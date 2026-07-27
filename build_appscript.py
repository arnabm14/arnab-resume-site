import os

css_path = r'c:\Code\resume-site\styles.css'
js_path = r'c:\Code\resume-site\script.js'
html_path = r'c:\Code\resume-site\index.html'
out_path = r'c:\Code\arnab_resume_appscript\index.html'

with open(css_path, encoding='utf-8') as f:
    css = f.read()
with open(js_path, encoding='utf-8') as f:
    js = f.read()
with open(html_path, encoding='utf-8') as f:
    html = f.read()

# Replace external CSS link with inline style
html = html.replace(
    '<link rel="stylesheet" href="styles.css">',
    '<style>\n' + css + '\n</style>'
)

# Replace external JS script with inline script
html = html.replace(
    '<script src="script.js"></script>',
    '<script>\n' + js + '\n</script>'
)

with open(out_path, 'w', encoding='utf-8') as f:
    f.write(html)

print(f"Done! Apps Script HTML: {len(html):,} bytes written to {out_path}")
