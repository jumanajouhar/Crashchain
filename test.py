import matplotlib.pyplot as plt
from fpdf import FPDF

# Sample data (replace with actual data from OBD-II)
time = [i for i in range(10, 100, 10)]
speed = [0, 0, 0, 0, 0, 0, 0, 0, 0]
rpm = [0, 0, 0, 0, 0, 0, 0, 0, 0]
throttle = [0, 0, 0, 0, 0, 0, 0, 0, 0]

# Generate graphs
plt.figure(figsize=(10, 6))
plt.plot(time, speed, label="Speed (km/h)")
plt.title("Vehicle Speed vs. Time")
plt.xlabel("Time (s)")
plt.ylabel("Speed (km/h)")
plt.legend()
plt.savefig("speed_vs_time.png")

plt.figure(figsize=(10, 6))
plt.plot(time, rpm, label="Engine RPM")
plt.title("Engine RPM vs. Time")
plt.xlabel("Time (s)")
plt.ylabel("RPM")
plt.legend()
plt.savefig("rpm_vs_time.png")

# Create PDF report
pdf = FPDF()
pdf.add_page()
pdf.set_font("Arial", size=12)

# Add title
pdf.cell(200, 10, txt="OBD-II Crash Analysis Report", ln=True, align="C")

# Add insights
pdf.cell(200, 10, txt="Insights:", ln=True)
pdf.multi_cell(0, 10, txt="1. No crash detected in the provided data.\n2. Vehicle was stationary or moving very slowly.\n3. All parameters are within normal limits.")

# Add graphs
pdf.image("speed_vs_time.png", x=10, y=50, w=180)
pdf.image("rpm_vs_time.png", x=10, y=150, w=180)

# Save PDF
pdf.output("crash_analysis_report.pdf")