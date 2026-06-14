import csv
import html
import re
import markdown
import os

BASE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(BASE, "data")

LINK_HEADER_RE = re.compile(r"(URL|Link|Website|LinkedIn|Page|Last Verified)", re.I)
MUTED_VALUE_RE = re.compile(r"^(Not |N/A$|TBD)", re.I)

def csv_to_html(path, title, anchor):
    with open(path, encoding="utf-8") as f:
        reader = csv.reader(f)
        rows = list(reader)
    if not rows:
        return ""
    header, body = rows[0], rows[1:]
    out = [f'<h2 id="{anchor}">{html.escape(title)}</h2>', '<div class="tablewrap"><table>']
    out.append("<thead><tr>" + "".join(f"<th>{html.escape(c)}</th>" for c in header) + "</tr></thead>")
    out.append("<tbody>")
    for row in body:
        cells = []
        for i, c in enumerate(row):
            classes = []
            if i == 0:
                classes.append("namecol")
            elif i < len(header) and LINK_HEADER_RE.search(header[i]):
                classes.append("linkcol")
            if MUTED_VALUE_RE.match(c.strip()):
                classes.append("muted")
            cls = f' class="{" ".join(classes)}"' if classes else ""
            cells.append(f"<td{cls}>{html.escape(c)}</td>")
        out.append(f"<tr>{''.join(cells)}</tr>")
    out.append("</tbody></table></div>")
    return "\n".join(out)

def md_to_html(path):
    with open(path, encoding="utf-8") as f:
        text = f.read()
    return markdown.markdown(text, extensions=["tables", "fenced_code"])

# (anchor, toc_title, html_content)
deliverables = [
    ("d1", "Deliverable 1: Recruitment Agencies & Placement Consultancies",
     csv_to_html(os.path.join(DATA, "01_recruitment_agencies.csv"),
                  "Deliverable 1: Recruitment Agencies & Placement Consultancies", "d1")),
    ("d2", "Deliverable 2: Companies Hiring in the Tricity IT Ecosystem",
     csv_to_html(os.path.join(DATA, "02_companies.csv"),
                  "Deliverable 2: Companies Hiring in the Tricity IT Ecosystem", "d2")),
    ("d3", "Deliverable 3: Active Openings & Live Search-Link Toolkit",
     csv_to_html(os.path.join(DATA, "03_active_openings.csv"),
                  "Deliverable 3: Active Openings & Live Search-Link Toolkit", "d3")),
    ("d4", "Deliverable 4: Recruiter / HR / TA Search Toolkit",
     f'<section id="d4">{md_to_html(os.path.join(DATA, "04_recruiter_search_toolkit.md"))}</section>'),
    ("d5", "Deliverable 5: Walk-in Visit Plan",
     f'<section id="d5">{md_to_html(os.path.join(DATA, "05_walkin_visit_plan.md"))}</section>'),
    ("d6", "Deliverable 6: Job Fairs, Recruitment Drives & Tech Meetups",
     csv_to_html(os.path.join(DATA, "06_events_job_fairs.csv"),
                  "Deliverable 6: Job Fairs, Recruitment Drives & Tech Meetups", "d6")),
    ("d7", "Deliverable 7: Job Communities",
     csv_to_html(os.path.join(DATA, "07_job_communities.csv"),
                  "Deliverable 7: Job Communities", "d7")),
    ("d8", "Deliverable 8: 30-Day Execution Plan",
     f'<section id="d8">{md_to_html(os.path.join(DATA, "08_30day_execution_plan.md"))}</section>'),
    ("d9", "Deliverable 9: Rankings",
     f'<section id="d9">{md_to_html(os.path.join(DATA, "09_rankings.md"))}</section>'),
    ("d10", "Deliverable 10: Paid Training & Placement Programs",
     f'<section id="d10">{md_to_html(os.path.join(DATA, "10_paid_training_placement_programs.md"))}</section>'),
]

readme_html = md_to_html(os.path.join(BASE, "README.md"))

toc_items = "".join(f'<li><a href="#{a}">{html.escape(t)}</a></li>' for a, t, _ in deliverables)
toc_html = f"""<h1>Table of Contents</h1>
<ol class="toc">
<li><a href="#readme">Overview &amp; Scope Notes</a></li>
{toc_items}
</ol>"""

sections = [f'<section id="readme">{readme_html}</section>', toc_html]
sections += [content for _, _, content in deliverables]

CSS = """
@page {
  size: A4 landscape;
  margin: 14mm 12mm;
  @bottom-center { content: "Page " counter(page) " of " counter(pages); font-size: 9px; color: #888; }
}
body { font-family: Arial, Helvetica, sans-serif; font-size: 10.5px; color: #1a1a1a; line-height: 1.45; }
h1 { font-size: 24px; color: #0b3d91; page-break-before: always; margin-bottom: 6px; }
h1:first-child { page-break-before: avoid; }
h2 { font-size: 16px; margin-top: 20px; margin-bottom: 10px; background: #2c3e50; color: #fff; padding: 6px 10px; border-radius: 3px; page-break-after: avoid; }
h3 { font-size: 13px; color: #1a5fb4; margin-top: 14px; }
p, li { font-size: 11px; line-height: 1.55; }
table { border-collapse: collapse; width: 100%; margin-bottom: 16px; table-layout: fixed; }
.tablewrap { page-break-inside: auto; }
thead { display: table-header-group; }
tr { page-break-inside: avoid; }
th, td { border: 1px solid #999; padding: 4px 5px; text-align: left; vertical-align: top; word-wrap: break-word; overflow-wrap: anywhere; font-size: 8.5px; }
th { background: #2c3e50; color: #fff; }
tr:nth-child(even) td { background: #f4f4f4; }
.namecol { font-weight: 700; color: #0b3d91; font-size: 9px; }
.linkcol { font-size: 7px; color: #666; }
.muted { color: #aaa; font-style: italic; }
a { color: #1a5fb4; word-break: break-all; }
hr { page-break-after: always; border: none; }
code { background: #eee; padding: 1px 3px; }
.toc { font-size: 13px; line-height: 2.2; list-style: decimal; }
.toc a { text-decoration: none; color: #1a5fb4; font-weight: 600; }
"""

doc = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Tricity Fresher Hiring Database - June 2026</title>
<style>{CSS}</style>
</head>
<body>
{'<hr>'.join(sections)}
</body>
</html>
"""

out_path = os.path.join(BASE, "Tricity_Fresher_Hiring_Database.html")
with open(out_path, "w", encoding="utf-8") as f:
    f.write(doc)

print("Wrote", out_path)
