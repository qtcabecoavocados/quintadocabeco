"""Gera o logótipo e os ícones da Quinta do Cabeço em images/brand/.

O símbolo: o arco de uma porta algarvia, o cabeço (pequena colina) que dá
nome à quinta e meio abacate com o caroço em amarelo, a cor das barras da
fachada.

Uso:  python scripts/build-brand.py
Os PNG são desenhados com o Chrome em modo headless (tem de estar instalado).
"""
import os, subprocess, sys, tempfile, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "images" / "brand"
OUT.mkdir(parents=True, exist_ok=True)

FOREST, CREAM, BEIGE, OCHRE, TERRA = "#2C3D2E", "#F7F2E9", "#EFE7DA", "#E3B23C", "#B5673F"
AV = "M60 40C52 40 48 48 47 58c-1 8-7 14-8 26-1 14 9 24 21 24s22-10 21-24c-1-12-7-18-8-26-1-10-5-18-13-18z"


def mark(color, seed=OCHRE, weight=1.0, bold=False):
    """Conteúdo do símbolo (viewBox 0 0 120 150)."""
    if bold:  # para tamanhos muito pequenos: menos linhas, traço grosso
        return f'''<g fill="none" stroke="{color}" stroke-linecap="round" stroke-linejoin="round" stroke-width="7">
<path d="M16 144V62a44 44 0 0 1 88 0v82"/><path d="M6 144h108"/>
<path d="M16 126c14-14 30-19 44-19s30 5 44 19"/><path d="{AV}" stroke-width="6"/></g>
<circle cx="60" cy="88" r="11" fill="{seed}"/>'''
    w = lambda x: f"{x * weight:.2f}"
    return f'''<g fill="none" stroke="{color}" stroke-linecap="round" stroke-linejoin="round">
<path d="M12 146V62a48 48 0 0 1 96 0v84" stroke-width="{w(2.4)}"/>
<path d="M19 146V63a41 41 0 0 1 82 0v83" stroke-width="{w(1)}"/>
<path d="M6 146h108" stroke-width="{w(2.4)}"/>
<path d="M19 128c14-15 30-20 41-20s27 5 41 20" stroke-width="{w(1.6)}"/>
<path d="{AV}" stroke-width="{w(1.6)}"/>
<path d="{AV}" transform="translate(60 88) scale(.8) translate(-60 -88)" stroke-width="{w(.8)}"/></g>
<circle cx="60" cy="88" r="10.5" fill="{seed}"/>'''


def svg_mark(color, **kw):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 150">{mark(color, **kw)}</svg>\n'


def svg_icon(size_units=512, pad=0.22, bg=FOREST, fg=BEIGE, weight=1.6, bold=False, radius=0):
    """Ícone quadrado: fundo verde e símbolo centrado."""
    h = size_units * (1 - 2 * pad)
    s = h / 150
    x = (size_units - 120 * s) / 2
    y = (size_units - 150 * s) / 2
    r = f' rx="{radius}"' if radius else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size_units} {size_units}">'
            f'<rect width="{size_units}" height="{size_units}"{r} fill="{bg}"/>'
            f'<g transform="translate({x:.2f} {y:.2f}) scale({s:.4f})">{mark(fg, weight=weight, bold=bold)}</g></svg>\n')


FONTS = '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400&family=Jost:wght@300&display=block" rel="stylesheet">'


def lockup_html(fg, sub, bg="transparent"):
    return f'''<!doctype html><html><head><meta charset="utf-8">{FONTS}<style>
html,body{{margin:0;background:{bg}}}
.l{{width:1200px;height:900px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px;color:{fg}}}
.a{{font:300 30px Jost;letter-spacing:.42em;text-transform:uppercase;margin-right:-.42em}}
.b{{font:400 128px/1 'Cormorant Garamond';margin-top:-14px}}
.c{{font:300 24px Jost;letter-spacing:.38em;text-transform:uppercase;color:{sub};margin-right:-.38em}}
</style></head><body><div class="l">
<svg width="176" height="220" viewBox="0 0 120 150">{mark(fg, weight=1.3)}</svg>
<div class="a">Quinta do</div><div class="b">Cabeço</div><div class="c">Tavira · Algarve</div></div></body></html>'''


def find_chrome():
    for p in [r"C:\Program Files\Google\Chrome\Application\chrome.exe",
              r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
              "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "google-chrome", "chromium"]:
        if os.path.exists(p) or p in ("google-chrome", "chromium"):
            return p
    sys.exit("Chrome não encontrado")


def render(html, out_png, w, h, transparent=False):
    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False, encoding="utf-8") as f:
        f.write(html)
        tmp = f.name
    args = [find_chrome(), "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
            "--virtual-time-budget=5000", f"--window-size={w},{h}", f"--screenshot={out_png}"]
    if transparent:
        args.append("--default-background-color=00000000")
    subprocess.run(args + [pathlib.Path(tmp).as_uri()], check=True, capture_output=True)
    os.unlink(tmp)


def page_for_svg(svg, w, h):
    return f'<!doctype html><html><head><style>html,body{{margin:0;background:transparent}}svg{{display:block;width:{w}px;height:{h}px}}</style></head><body>{svg}</body></html>'


def main():
    files = {
        "logo-mark.svg": svg_mark(FOREST),
        "logo-mark-light.svg": svg_mark(CREAM),
        "logo-mark-bold.svg": svg_mark(FOREST, bold=True),
        "favicon.svg": svg_icon(64, pad=0.14, bold=True, radius=12),
        "app-icon.svg": svg_icon(1024, pad=0.2, weight=2.2),
    }
    for name, content in files.items():
        (OUT / name).write_text(content, encoding="utf-8")

    # Ícones (o iPhone arredonda os cantos sozinho, por isso o fundo vai até à margem)
    icon = svg_icon(1024, pad=0.2, weight=2.2)
    maskable = svg_icon(1024, pad=0.27, weight=2.6)
    for name, svg, size in [
        ("apple-touch-icon.png", icon, 180),
        ("icon-192.png", icon, 192),
        ("icon-512.png", icon, 512),
        ("icon-maskable-512.png", maskable, 512),
        ("app-icon-1024.png", icon, 1024),
    ]:
        render(page_for_svg(svg, size, size), str(OUT / name), size, size)
    render(page_for_svg(svg_icon(64, pad=0.14, bold=True, radius=12), 32, 32), str(OUT / "favicon-32.png"), 32, 32, transparent=True)

    # Assinatura completa (com texto), clara e escura
    render(lockup_html(FOREST, TERRA), str(OUT / "logo.png"), 1200, 900, transparent=True)
    render(lockup_html(CREAM, OCHRE, bg=FOREST), str(OUT / "logo-dark.png"), 1200, 900)
    # Imagem para partilha em redes sociais / WhatsApp
    render(lockup_html(FOREST, TERRA, bg=BEIGE).replace("height:900px", "height:630px").replace("gap:34px", "gap:22px")
           .replace("width=\"176\" height=\"220\"", "width=\"128\" height=\"160\"").replace("128px/1", "104px/1"),
           str(OUT / "share.png"), 1200, 630)
    print("Feito:", ", ".join(sorted(p.name for p in OUT.iterdir())))


if __name__ == "__main__":
    main()
