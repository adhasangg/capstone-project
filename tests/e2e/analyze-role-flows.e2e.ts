import { expect, test } from '@playwright/test';

test.describe('Analisis Flow UI: Mahasiswa, Dosen/Konselor, dan Sysadmin', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?sandbox_key=safespace-evaluator-2026');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
      sessionStorage.setItem('safespace_sandbox_unlocked', 'true');
    });
    await page.reload();
  });

  test('Flow 1: Pengunjung Publik (Landing Page, Tentang SafeSpace, Portal Auth)', async ({
    page,
  }) => {
    // 1. Landing Page
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: /Ruang Aman Anonim untuk Mengurai/i }),
    ).toBeVisible();
    await page.screenshot({
      path: 'docs/screenshots/flow-01-public-landing.png',
      fullPage: true,
    });

    // 2. Tentang SafeSpace & Metodologi
    await page.getByRole('button', { name: 'Tentang SafeSpace' }).first().click();
    await expect(
      page.getByRole('heading', {
        name: /Memanusiakan Pembelajaran Jarak Jauh/i,
      }),
    ).toBeVisible();
    await page.screenshot({
      path: 'docs/screenshots/flow-02-public-about.png',
      fullPage: true,
    });

    // 3. Portal Auth (Masuk / Daftar)
    await page
      .getByRole('button', { name: /Masuk \/ Daftar/i })
      .first()
      .click();
    await expect(page.getByText('Portal Otentikasi')).toBeVisible();
    await expect(page.getByText('Mode Sandbox Evaluator Aktif:')).toBeVisible();
    await page.screenshot({
      path: 'docs/screenshots/flow-03-public-auth-gate.png',
      fullPage: true,
    });
  });

  test('Flow 2: Peran Mahasiswa PJJ (Dashboard, Asesmen Mandiri DASS-21/VAK, Mood Tracker)', async ({
    page,
  }) => {
    await page.goto('/#/auth');

    // Login via Mahasiswa Sandbox
    const studentBtn = page.getByRole('button', { name: /^Mahasiswa$/i });
    await expect(studentBtn).toBeVisible();
    await studentBtn.click();

    // 1. Dashboard Mahasiswa
    await expect(page.getByText('Pusat Kendali Kesehatan Mental & Gaya Belajar PJJ')).toBeVisible();

    // Buka tiket pra-konseling untuk menampilkan samaran sesi dinamis
    const openTicketBtn = page.getByRole('button', { name: /Buka Tiket Pra-Konseling/i });
    if (await openTicketBtn.isVisible()) {
      await openTicketBtn.click();
      await page.waitForTimeout(600);
      await openTicketBtn.click();
      await page.waitForTimeout(600);
    }

    await page.screenshot({
      path: 'docs/screenshots/flow-04-mahasiswa-dashboard.png',
      fullPage: true,
    });

    // 2. Buka Asesmen Mandiri
    await page.getByRole('button', { name: 'Asesmen Mandiri' }).first().click();
    await expect(page.getByText('Pertanyaan 1 dari 21')).toBeVisible();
    await page.screenshot({
      path: 'docs/screenshots/flow-05-mahasiswa-asesmen.png',
      fullPage: true,
    });

    // 3. Buka Curhat Mood Tracker
    await page.getByRole('button', { name: 'Curhat Refleksi' }).first().click();
    await expect(
      page.getByRole('heading', { name: /Catatan Refleksi & Curhat Harian/i }),
    ).toBeVisible();
    await page.screenshot({
      path: 'docs/screenshots/flow-06-mahasiswa-curhat.png',
      fullPage: true,
    });
  });

  test('Flow 3: Peran Konselor / Dosen Pembimbing (Antrean Triage & Riwayat Pendampingan)', async ({
    page,
  }) => {
    await page.goto('/#/auth');

    // Login via Konselor Sandbox
    const counselorBtn = page.getByRole('button', { name: /^Konselor$/i });
    await expect(counselorBtn).toBeVisible();
    await counselorBtn.click();

    // 1. Antrean Triage Konselor (Tab Antrean Menunggu Triage)
    await expect(
      page.getByRole('heading', {
        name: /Antrean Triage Pra-Konseling Anonim/i,
      }),
    ).toBeVisible();
    await expect(page.locator('header').getByText('Konselor').first()).toBeVisible();
    await page.screenshot({
      path: 'docs/screenshots/flow-07-konselor-antrean.png',
      fullPage: true,
    });

    // 2. Terima tiket jika ada untuk menguji pencatatan riwayat pendampingan
    const acceptBtn = page.getByRole('button', { name: /Terima & Masuk Sesi/i }).first();
    if (await acceptBtn.isVisible()) {
      await acceptBtn.click();
      await page.waitForTimeout(800);
      await page.getByRole('button', { name: 'Antrean Triage Konselor' }).click();
      await page.waitForTimeout(500);
    }

    // 3. Tab Riwayat Pendampingan Saya
    const historyTabBtn = page.getByRole('button', { name: /Riwayat Pendampingan Saya/i });
    await expect(historyTabBtn).toBeVisible();
    await historyTabBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: 'docs/screenshots/flow-07-b-konselor-riwayat.png',
      fullPage: true,
    });
  });

  test('Flow 4: Peran Sysadmin (Pusat Kendali Sistem & Manajemen Elevasi Peran)', async ({
    page,
  }) => {
    await page.goto('/#/auth');

    // Login via Sysadmin Sandbox
    const adminBtn = page.getByRole('button', { name: /^Sysadmin$/i });
    await expect(adminBtn).toBeVisible();
    await adminBtn.click();

    // Panel Sysadmin Dashboard
    await expect(page.getByText('Sysadmin Dashboard')).toBeVisible();
    await expect(
      page.getByRole('heading', {
        name: /Pusat Kendali Sistem & Manajemen Peran/i,
      }),
    ).toBeVisible();
    await expect(page.getByText('Daftar Akun Pengguna & Penetapan Peran')).toBeVisible();

    // Verifikasi pemisahan hak akses Sysadmin (Separation of Duties & Least Privilege):
    // 1. Antrean Konseling dan Simulasi Mahasiswa TIDAK boleh ada di navbar
    await expect(page.getByRole('button', { name: 'Antrean Konseling' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Simulasi Mahasiswa' })).not.toBeVisible();

    // 2. Tombol Lihat Antrean Konseling TIDAK boleh ada di header dashboard
    await expect(page.getByRole('button', { name: 'Lihat Antrean Konseling' })).not.toBeVisible();

    // 3. Hanya Panel Sysadmin dan Panduan yang tampil di navigasi
    await expect(page.getByRole('button', { name: 'Panel Sysadmin' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Panduan' })).toBeVisible();

    // 4. Verifikasi akun Sysadmin di tabel memiliki badge terproteksi tanpa tombol mutasi ke mahasiswa
    await expect(page.getByText('Akun Terproteksi (Tidak Dapat Diubah)')).toBeVisible();

    await page.screenshot({
      path: 'docs/screenshots/flow-08-sysadmin-dashboard.png',
      fullPage: true,
    });
  });
});
