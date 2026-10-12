import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

wb = openpyxl.Workbook()

# Sheet 1: Bank Soal & Google Form
ws1 = wb.active
ws1.title = "Panduan & Teks Google Form"

font_title = Font(name="Calibri", size=14, bold=True, color="1E293B")
font_subtitle = Font(name="Calibri", size=11, italic=True, color="64748B")
font_header = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
font_bold = Font(name="Calibri", size=11, bold=True, color="1E293B")
font_regular = Font(name="Calibri", size=11, color="334155")

fill_navy = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid")
fill_teal = PatternFill(start_color="0D9488", end_color="0D9488", fill_type="solid")
fill_soft = PatternFill(start_color="F1F5F9", end_color="F1F5F9", fill_type="solid")

thin_border = Border(
    left=Side(style="thin", color="CBD5E1"),
    right=Side(style="thin", color="CBD5E1"),
    top=Side(style="thin", color="CBD5E1"),
    bottom=Side(style="thin", color="CBD5E1")
)

ws1["A1"] = "PANDUAN PENYUSUNAN GOOGLE FORM UAT (SYSTEM USABILITY SCALE)"
ws1["A1"].font = font_title
ws1["A2"] = "Salin (copy-paste) butir teks di bawah ini ke dalam Google Form untuk disebarkan ke 20-30 responden mahasiswa UT."
ws1["A2"].font = font_subtitle

headers_ws1 = ["No", "Tipe Soal", "Pernyataan Kuesioner SUS", "Pilihan Skala (Skala Likert 1-5)", "Sifat Evaluasi"]
for col_idx, h in enumerate(headers_ws1, 1):
    cell = ws1.cell(row=4, column=col_idx, value=h)
    cell.font = font_header
    cell.fill = fill_navy
    cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)

questions = [
    (1, "Ganjil", "Saya berpikir akan sering menggunakan sistem SafeSpace PWA ini.", "1 (Sangat Tidak Setuju) s.d 5 (Sangat Setuju)", "Positif"),
    (2, "Genap", "Saya merasa sistem ini terlalu rumit, padahal dapat dibuat lebih sederhana.", "1 (Sangat Tidak Setuju) s.d 5 (Sangat Setuju)", "Negatif"),
    (3, "Ganjil", "Saya merasa sistem ini sangat mudah untuk digunakan.", "1 (Sangat Tidak Setuju) s.d 5 (Sangat Setuju)", "Positif"),
    (4, "Genap", "Saya merasa membutuhkan bantuan orang lain untuk dapat menggunakan sistem ini.", "1 (Sangat Tidak Setuju) s.d 5 (Sangat Setuju)", "Negatif"),
    (5, "Ganjil", "Saya merasa fitur-fitur dalam sistem ini terintegrasi dengan sangat baik.", "1 (Sangat Tidak Setuju) s.d 5 (Sangat Setuju)", "Positif"),
    (6, "Genap", "Saya merasa sistem ini terlalu banyak hal yang tidak konsisten.", "1 (Sangat Tidak Setuju) s.d 5 (Sangat Setuju)", "Negatif"),
    (7, "Ganjil", "Saya merasa orang lain akan dapat mempelajari sistem ini dengan sangat cepat.", "1 (Sangat Tidak Setuju) s.d 5 (Sangat Setuju)", "Positif"),
    (8, "Genap", "Saya merasa sistem ini membingungkan dan membuat canggung saat digunakan.", "1 (Sangat Tidak Setuju) s.d 5 (Sangat Setuju)", "Negatif"),
    (9, "Ganjil", "Saya merasa sangat percaya diri dan aman (privat) saat menggunakan sistem ini.", "1 (Sangat Tidak Setuju) s.d 5 (Sangat Setuju)", "Positif"),
    (10, "Genap", "Saya harus mempelajari banyak hal terlebih dahulu sebelum dapat menggunakan sistem ini.", "1 (Sangat Tidak Setuju) s.d 5 (Sangat Setuju)", "Negatif"),
]

for idx, q in enumerate(questions, 5):
    for c_idx, val in enumerate(q, 1):
        c = ws1.cell(row=idx, column=c_idx, value=val)
        c.font = font_regular
        c.border = thin_border
        if c_idx in [1, 2, 5]:
            c.alignment = Alignment(horizontal="center", vertical="center")

ws1.column_dimensions["A"].width = 6
ws1.column_dimensions["B"].width = 12
ws1.column_dimensions["C"].width = 65
ws1.column_dimensions["D"].width = 35
ws1.column_dimensions["E"].width = 15

# Sheet 2: Kalkulator Otomatis Skor SUS
ws2 = wb.create_sheet(title="Kalkulator Skor SUS")
ws2["A1"] = "KALKULATOR OTOMATIS SYSTEM USABILITY SCALE (SUS)"
ws2["A1"].font = font_title
ws2["A2"] = "Masukkan data jawaban responden (skala 1-5). Rumus menghitung skor kontribusi, total skor, dan grade secara otomatis."
ws2["A2"].font = font_subtitle

headers_ws2 = [
    "No", "Inisial / Nama", "Program Studi",
    "Q1 (Pos)", "Q2 (Neg)", "Q3 (Pos)", "Q4 (Neg)", "Q5 (Pos)",
    "Q6 (Neg)", "Q7 (Pos)", "Q8 (Neg)", "Q9 (Pos)", "Q10 (Neg)",
    "Total Kontribusi (0-40)", "Skor Akhir SUS (0-100)", "Kategori Kelayakan"
]

for col_idx, h in enumerate(headers_ws2, 1):
    cell = ws2.cell(row=4, column=col_idx, value=h)
    cell.font = font_header
    cell.fill = fill_teal
    cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)

sample_data = [
    (1, "Mhs 01", "Sistem Informasi", 4, 1, 5, 1, 5, 2, 5, 1, 5, 1),
    (2, "Mhs 02", "Ilmu Komunikasi", 4, 2, 4, 1, 4, 1, 4, 2, 5, 1),
    (3, "Mhs 03", "Manajemen", 5, 1, 5, 2, 4, 1, 5, 1, 5, 2),
    (4, "Mhs 04", "Informatika", 4, 2, 4, 2, 4, 2, 4, 1, 4, 1),
    (5, "Mhs 05", "Sistem Informasi", 5, 1, 5, 1, 5, 1, 5, 2, 5, 1),
]

start_row = 5
num_rows = 25

for i in range(num_rows):
    row_num = start_row + i
    resp_no = i + 1
    
    if i < len(sample_data):
        sd = sample_data[i]
        ws2.cell(row=row_num, column=1, value=sd[0])
        ws2.cell(row=row_num, column=2, value=sd[1])
        ws2.cell(row=row_num, column=3, value=sd[2])
        for q_idx in range(10):
            ws2.cell(row=row_num, column=4 + q_idx, value=sd[3 + q_idx])
    else:
        ws2.cell(row=row_num, column=1, value=resp_no)
        ws2.cell(row=row_num, column=2, value=f"Mhs {resp_no:02d}")
        ws2.cell(row=row_num, column=3, value="Sistem Informasi")
        for q_idx in range(10):
            ws2.cell(row=row_num, column=4 + q_idx, value="")

    formula_contrib = f'=IF(D{row_num}="","",(D{row_num}-1)+(5-E{row_num})+(F{row_num}-1)+(5-G{row_num})+(H{row_num}-1)+(5-I{row_num})+(J{row_num}-1)+(5-K{row_num})+(L{row_num}-1)+(5-M{row_num}))'
    ws2.cell(row=row_num, column=14, value=formula_contrib)
    
    formula_sus = f'=IF(N{row_num}="","",N{row_num}*2.5)'
    ws2.cell(row=row_num, column=15, value=formula_sus)
    
    formula_kat = f'=IF(O{row_num}="","",IF(O{row_num}>=80.3,"Excellent (Grade A)",IF(O{row_num}>=68,"Good (Grade B)","Marginal / Low")))'
    ws2.cell(row=row_num, column=16, value=formula_kat)

    for col in range(1, 17):
        c = ws2.cell(row=row_num, column=col)
        c.font = font_regular
        c.border = thin_border
        if col in [1, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]:
            c.alignment = Alignment(horizontal="center", vertical="center")

avg_row = start_row + num_rows
ws2.cell(row=avg_row, column=1, value="RATA-RATA")
ws2.cell(row=avg_row, column=1).font = font_bold
ws2.cell(row=avg_row, column=1).alignment = Alignment(horizontal="center", vertical="center")
ws2.cell(row=avg_row, column=1).fill = fill_soft

for c in range(2, 14):
    cell = ws2.cell(row=avg_row, column=c, value="-")
    cell.font = font_bold
    cell.alignment = Alignment(horizontal="center", vertical="center")
    cell.fill = fill_soft
    cell.border = thin_border

cell_avg_score = ws2.cell(row=avg_row, column=15, value=f"=AVERAGE(O{start_row}:O{avg_row-1})")
cell_avg_score.font = font_bold
cell_avg_score.fill = fill_soft
cell_avg_score.alignment = Alignment(horizontal="center", vertical="center")
cell_avg_score.border = thin_border

cell_avg_grade = ws2.cell(row=avg_row, column=16, value=f'=IF(O{avg_row}>=80.3,"Excellent (Grade A)",IF(O{avg_row}>=68,"Good (Grade B)","Marginal"))')
cell_avg_grade.font = font_bold
cell_avg_grade.fill = fill_soft
cell_avg_grade.alignment = Alignment(horizontal="center", vertical="center")
cell_avg_grade.border = thin_border

widths = {"A": 6, "B": 16, "C": 20, "D": 10, "E": 10, "F": 10, "G": 10, "H": 10,
          "I": 10, "J": 10, "K": 10, "L": 10, "M": 10, "N": 16, "O": 16, "P": 22}
for col_l, w in widths.items():
    ws2.column_dimensions[col_l].width = w

output_path = r"d:\ijplabs\capstone\docs\UAT_SUS_Kalkulator_Otomatis.xlsx"
wb.save(output_path)
print("SUCCESS: Created Excel file at", output_path)
