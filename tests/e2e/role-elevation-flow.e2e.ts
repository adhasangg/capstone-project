import { expect, test } from '@playwright/test';

test.describe('E2E Test: Verifikasi Siklus Elevasi Peran Mahasiswa -> Konselor', () => {
  test.beforeEach(async ({ page }) => {
    // Bersihkan sesi browser dan aktifkan sandbox untuk lingkungan testing
    await page.goto('/?sandbox_key=safespace-evaluator-2026');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
      sessionStorage.setItem('safespace_sandbox_unlocked', 'true');
    });
    await page.reload();
  });

  test('TC-E2E-ROLE-01: Akun Mahasiswa yang Dielevasi Menjadi Konselor Harus Menampilkan Menu Konselor secara Konsisten', async ({
    page,
  }) => {
    // 1. Masuk sebagai Sysadmin terlebih dahulu untuk memastikan akun pengujian berstatus Mahasiswa
    await page.goto('/#/auth');
    // 1. Masuk sebagai Mahasiswa
    await page.goto('/#/auth');
    const studentBtn = page.getByRole('button', { name: /^Mahasiswa$/i });
    await expect(studentBtn).toBeVisible();
    await studentBtn.click();

    // Pastikan Navbar menampilkan menu Mahasiswa
    await expect(page.getByRole('button', { name: 'Asesmen Mandiri' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Curhat Refleksi' }).first()).toBeVisible();
    await expect(page.locator('header').getByText('Mahasiswa').first()).toBeVisible();

    // 2. Logout dari akun Mahasiswa
    const logoutBtn = page.locator('header button[title="Keluar dari sesi"]').first();
    await logoutBtn.click();
    await expect(page.locator('header button[title="Keluar dari sesi"]')).toHaveCount(0);

    // 3. Masuk sebagai Sysadmin untuk menaikkan peran ke Konselor
    await page.goto('/#/auth');
    const adminBtn = page.getByRole('button', { name: /^Sysadmin$/i });
    await expect(adminBtn).toBeVisible();
    await adminBtn.click();
    await page.goto('/#/admin/dashboard');
    await expect(page.getByText('Pusat Kendali Sistem & Manajemen Peran')).toBeVisible();

    // Cari baris akun Mahasiswa di tabel manajemen pengguna dan simpan User ID spesifiknya
    const studentRow = page.locator('tr').filter({ hasText: 'Mahasiswa PJJ' }).first();
    await expect(studentRow).toBeVisible();
    const studentUserId = await studentRow.locator('td.font-mono').innerText();

    // Klik tombol elevasi ke Konselor
    const elevateBtn = studentRow.getByRole('button', { name: 'Jadikan Konselor/Dosen' });
    await elevateBtn.click();

    // Verifikasi notifikasi berhasil
    await expect(page.getByText(/Peran pengguna berhasil diperbarui/i)).toBeVisible();

    // Verifikasi bahwa baris pengguna tersebut sekarang berlabel Konselor / Dosen BK
    const elevatedRow = page.locator('tr').filter({ hasText: studentUserId }).first();
    await expect(elevatedRow.getByText('Konselor / Dosen BK')).toBeVisible();

    // 4. Logout dari Sysadmin
    await logoutBtn.click();
    await expect(page.locator('header button[title="Keluar dari sesi"]')).toHaveCount(0);

    // 5. Masuk kembali menggunakan akun yang baru saja dielevasi (dev_token_student)
    await page.goto('/#/auth');
    await studentBtn.click();

    // ==========================================
    // VERIFIKASI UTAMA PERBAIKAN BUG ELEVASI:
    // ==========================================
    // A. Menu pada Navbar HARUS BERUBAH menjadi menu Konselor!
    await expect(
      page.getByRole('button', { name: 'Antrean Triage Konselor' }).first(),
    ).toBeVisible();
    await expect(page.locator('header').getByText('Konselor').first()).toBeVisible();

    // B. Menu Mahasiswa (Asesmen Mandiri & Curhat Refleksi) TIDAK BOLEH tampil di navbar
    await expect(page.getByRole('button', { name: 'Asesmen Mandiri' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Curhat Refleksi' })).toHaveCount(0);

    // C. Uji Akses Endpoint Antrean Konselor (Bebas dari galat HTTP 403 Forbidden)
    await page.getByRole('button', { name: 'Antrean Triage Konselor' }).first().click();
    await expect(page.getByText('Antrean Triage Pra-Konseling Anonim')).toBeVisible();

    // D. Uji Ketahanan Sesi saat Halaman Direfresh (F5 Reload)
    await page.reload();
    await expect(
      page.getByRole('button', { name: 'Antrean Triage Konselor' }).first(),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Asesmen Mandiri' })).toHaveCount(0);

    // E. Ambil screenshot sebagai bukti pengujian E2E development
    await page.screenshot({
      path: 'docs/screenshots/e2e-counselor-menu-verified.png',
      fullPage: true,
    });

    // F. Kembalikan peran akun ke Mahasiswa menggunakan User ID spesifik agar isolasi pengujian antar-suite tetap terjaga
    await logoutBtn.click();
    await expect(page.locator('header button[title="Keluar dari sesi"]')).toHaveCount(0);
    await page.goto('/#/auth');
    await adminBtn.click();
    await page.goto('/#/admin/dashboard');
    const rowToReset = page.locator('tr').filter({ hasText: studentUserId }).first();
    await expect(rowToReset).toBeVisible({ timeout: 5000 });
    await rowToReset.getByRole('button', { name: 'Ubah ke Mahasiswa' }).click();
    await expect(page.getByText(/Peran pengguna berhasil diperbarui/i)).toBeVisible({
      timeout: 5000,
    });
    await logoutBtn.click();
    await expect(page.locator('header button[title="Keluar dari sesi"]')).toHaveCount(0);
  });
});
