import { expect, test } from '@playwright/test';

test.describe('SafeSpace PWA: End-to-End System Integration Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear storage and unlock evaluator sandbox for automated testing
    await page.goto('/?sandbox_key=safespace-evaluator-2026');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
      sessionStorage.setItem('safespace_sandbox_unlocked', 'true');
    });
    await page.reload();
  });

  test('TC-E2E-01: Landing Page & Anonimity Verification', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/SafeSpace/i);

    // Verify Brand & Hero
    const heroHeading = page.locator('h1');
    await expect(heroHeading).toContainText('Ruang Aman Anonim untuk Mengurai');
    await expect(heroHeading).toContainText('Academic Burnout');

    // Verify Trauma-Informed Safe Exit Button
    const safeExitBtn = page.getByRole('button', { name: /Safe Exit/i });
    await expect(safeExitBtn).toBeVisible();

    // Verify Anonymous Banner
    await expect(page.getByText('Zero-Knowledge').first()).toBeVisible();

    // Verify Three Pillars (using heading role to prevent strict mode duplicate with footer)
    await expect(page.getByRole('heading', { name: 'Two-Way Anonymity' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Instrumen Baku & Terukur' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Attached Profile Ticketing' })).toBeVisible();

    await page.screenshot({ path: 'docs/screenshots/01-landing-page.png', fullPage: true });
  });

  test('TC-E2E-02: DASS-21 Emotional Assessment Complete Workflow', async ({ page }) => {
    await page.goto('/#/auth');
    await page.getByRole('button', { name: /^Mahasiswa$/i }).click();

    // Navigate to Assessment tab
    await page.getByRole('button', { name: 'Asesmen Mandiri' }).first().click();
    await expect(page.getByText('Pertanyaan 1 dari 21')).toBeVisible();

    await page.screenshot({ path: 'docs/screenshots/02-dass21-question.png' });

    // Answer all 21 items: selecting score auto-advances until Q21
    for (let i = 1; i <= 21; i++) {
      await expect(page.getByText(`Pertanyaan ${i} dari 21`)).toBeVisible();
      // Select Likert option score 2 ("Sering")
      await page.getByRole('button', { name: /^2\s+Sering/i }).click();
    }

    // Question 21: Submit button is enabled
    const submitBtn = page.getByRole('button', { name: /Lihat Hasil Analisis/i });
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    // Verify DASS-21 Result View
    await expect(page.getByText('Hasil Pemetaan Emosional DASS-21')).toBeVisible();
    await expect(page.getByText('Depresi (D)')).toBeVisible();
    await expect(page.getByText('Kecemasan (A)')).toBeVisible();
    await expect(page.getByText('Stres (S)')).toBeVisible();

    // Verify Burnout Risk Banner
    await expect(page.getByText(/Tingkat Resiko Burnout/i)).toBeVisible();

    await page.screenshot({ path: 'docs/screenshots/03-dass21-result.png' });
  });

  test('TC-E2E-03: VAK Learning Modality Assessment Complete Workflow', async ({ page }) => {
    await page.goto('/#/auth');
    await page.getByRole('button', { name: /^Mahasiswa$/i }).click();

    // Navigate to Assessment tab
    await page.getByRole('button', { name: 'Asesmen Mandiri' }).first().click();

    // Switch to VAK Subtab
    await page.getByRole('button', { name: '2. Gaya Belajar (VAK)' }).click();
    await expect(page.getByText('Skenario 1 dari 12')).toBeVisible();

    await page.screenshot({ path: 'docs/screenshots/04-vak-question.png' });

    // Answer 12 scenarios: selecting option card in .space-y-3 auto-advances until scenario 12
    for (let i = 1; i <= 12; i++) {
      await expect(page.getByText(`Skenario ${i} dari 12`)).toBeVisible();

      // Pick the first option card of current scenario
      const option = page.locator('div.space-y-3 > button').first();
      await option.click();
    }

    // Submit VAK questionnaire
    const submitBtn = page.getByRole('button', { name: /Lihat Profil Gaya Belajar/i });
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    // Verify VAK Result View
    await expect(page.getByText('Profil Modalitas Belajar VAK Anda')).toBeVisible();
    await expect(page.getByText('Modalitas Dominan')).toBeVisible();
    await expect(page.getByText(/Visual \(/i)).toBeVisible();
    await expect(page.getByText(/Auditori \(/i)).toBeVisible();
    await expect(page.getByText(/Kinestetik \(/i)).toBeVisible();

    await page.screenshot({ path: 'docs/screenshots/05-vak-result.png' });
  });

  test('TC-E2E-04: Mood Tracker Reflection with Icebreakers & Empathetic Feedback', async ({
    page,
  }) => {
    await page.goto('/#/auth');
    await page.getByRole('button', { name: /^Mahasiswa$/i }).click();

    // Navigate to Mood Tracker / Curhat Refleksi
    await page.getByRole('button', { name: 'Curhat Refleksi' }).first().click();
    await expect(page.getByText('Catatan Refleksi & Curhat Harian')).toBeVisible();

    // Click an icebreaker pill
    const icebreakerBtn = page.getByRole('button', { name: /Saya merasa sangat lelah/i });
    await expect(icebreakerBtn).toBeVisible();
    await icebreakerBtn.click();

    // Verify textarea populated
    const textarea = page.locator('textarea');
    await expect(textarea).toHaveValue(/Saya merasa sangat lelah/i);

    // Append additional reflection
    await textarea.fill(
      'Saya merasa sangat lelah membagi waktu antara kerja lembur dan deadline tuton minggu ini. Kepala terasa berat.',
    );

    // Submit reflection
    await page.getByRole('button', { name: /Kirim & Resapi Refleksi/i }).click();

    // Verify Empathetic Response from backend
    await expect(page.getByText('Respon Empati Sistem')).toBeVisible();
    await expect(page.getByText('Sentimen:')).toBeVisible();
    await expect(page.getByText('Indikator Krisis:')).toBeVisible();

    await page.screenshot({ path: 'docs/screenshots/06-mood-tracker.png' });
  });

  test('TC-E2E-05: Attached-Profile Ticketing & Counselor Triage to E2EE Chatroom', async ({
    page,
  }) => {
    await page.goto('/#/auth');

    // Step 0: Authenticate as Student via Sandbox Google OAuth
    await expect(page.getByText('Mode Sandbox Evaluator Aktif:')).toBeVisible();
    await page.getByRole('button', { name: /^Mahasiswa$/i }).click();
    await expect(page.getByText('Pusat Kendali Kesehatan Mental & Gaya Belajar PJJ')).toBeVisible();

    // Step 1: Complete DASS-21 to attach profile
    await page.getByRole('button', { name: 'Asesmen Mandiri' }).first().click();
    for (let i = 1; i <= 21; i++) {
      await page.getByRole('button', { name: /^2\s+Sering/i }).click();
    }
    await page.getByRole('button', { name: /Lihat Hasil Analisis/i }).click();
    await expect(page.getByText('Hasil Pemetaan Emosional DASS-21')).toBeVisible();

    // Step 2: Click "Lampirkan ke Tiket Pra-Konseling" which navigates to Dashboard
    await page.getByRole('button', { name: /Lampirkan ke Tiket Pra-Konseling/i }).click();
    await expect(page.getByText('Pusat Kendali Kesehatan Mental & Gaya Belajar PJJ')).toBeVisible();

    // Verify DASS-21 card shows score
    await expect(page.getByText('Status Emosional (DASS-21)')).toBeVisible();

    // Step 3: Open pra-counseling ticket
    const openTicketBtn = page.getByRole('button', { name: /Buka Tiket Pra-Konseling/i });
    await openTicketBtn.click();

    // Verify ticket created notification and table entry
    await expect(page.getByText(/berhasil dibuka/i)).toBeVisible();
    await expect(page.getByText('Menunggu Konselor').first()).toBeVisible();
    await expect(page.getByText('✓ DASS-21 Terlampir').first()).toBeVisible();

    await page.screenshot({ path: 'docs/screenshots/07-student-dashboard.png' });

    // Step 4: Logout and switch role to Counselor
    const logoutBtn = page.locator('button[title="Keluar dari sesi"]');
    await logoutBtn.click();
    await expect(logoutBtn).toHaveCount(0);

    // Go to Auth page and choose "Konselor"
    await page.goto('/#/auth');
    await expect(page.getByText('Mode Sandbox Evaluator Aktif:')).toBeVisible();
    await page.getByRole('button', { name: /^Konselor$/i }).click();

    // Step 5: Counselor Queue view
    await expect(page.getByText('Antrean Triage Pra-Konseling Anonim')).toBeVisible();
    await expect(page.getByText(/Konselor/i).first()).toBeVisible();
    await expect(page.getByText('Lampiran Hasil DASS-21:').first()).toBeVisible();

    await page.screenshot({ path: 'docs/screenshots/08-counselor-queue.png' });

    // Step 6: Counselor accepts ticket and enters chatroom
    const acceptBtn = page.getByRole('button', { name: /Terima & Masuk Sesi/i }).first();
    await acceptBtn.click();

    // Step 7: Chatroom E2EE verification & Wire Transmission Proof
    await expect(page.getByText(/Ruang Pra-Konseling #/i)).toBeVisible();
    await expect(
      page.getByText('Terkunci Enkripsi End-to-End (E2EE) • Double-Blind Anonim'),
    ).toBeVisible();
    await expect(page.getByText('AES-GCM 256-bit', { exact: true })).toBeVisible();

    // Prepare network interception to prove Zero-Knowledge ciphertext wire transmission
    const plainTextMessage =
      'Halo rekan mahasiswa, saya Konselor_A. Saya sudah membaca lampiran DASS-21 Anda. Bagaimana perasaan Anda hari ini?';
    const wireRequestPromise = page.waitForRequest(
      (request) =>
        request.url().includes('/api/chat/') &&
        request.url().endsWith('/send') &&
        request.method() === 'POST',
      { timeout: 10000 },
    );

    // Counselor sends message
    const chatInput = page.locator('input[placeholder*="Ketik pesan aman Anda"]');
    await chatInput.fill(plainTextMessage);
    await page.getByRole('button', { name: /Kirim/i }).click();

    // Verify wire payload from browser to server
    const wireRequest = await wireRequestPromise;
    const postData = JSON.parse(wireRequest.postData() || '{}');
    expect(postData.encryptedContent).toBeDefined();
    expect(postData.iv).toBeDefined();
    // CRITICAL PROOF: Ciphertext transmitted over network must NEVER leak plaintext
    expect(postData.encryptedContent).not.toContain('Halo rekan mahasiswa');
    expect(wireRequest.postData()).not.toContain('Halo rekan mahasiswa');

    // Verify message appears decrypted in thread
    await expect(page.getByText(/Halo rekan mahasiswa, saya Konselor_A/i)).toBeVisible();

    await page.screenshot({ path: 'docs/screenshots/09-e2ee-chat-room.png' });
  });

  test('TC-E2E-06: Verification of Trauma-Informed Safe Exit Emergency Redirect', async ({
    page,
  }) => {
    await page.goto('/');

    const safeExitBtn = page.getByRole('button', { name: /Safe Exit/i });
    await expect(safeExitBtn).toBeVisible();

    // Intercept navigation or wait for page redirection to google
    await safeExitBtn.click();
    await page.waitForURL(/google\.com/, { timeout: 10000 });
    expect(page.url()).toContain('google.com');
  });
});
