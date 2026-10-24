"""
Baut Kopfbereich, Startseite und Fussbereich des PWA-Shops im Zalando-nahen Stil
und speichert sie ueber die lokale Middleware (localhost:8181) in plentyONE.

Aufruf:
  python3 arizona/startseite_bloecke.py            -> Testlauf, schreibt nur arizona/startseite_bloecke.json
  python3 arizona/startseite_bloecke.py speichern  -> speichert in plentyONE (nur PWA-Shop, nicht live)

Voraussetzung: der Dev-Server laeuft (npm run dev), damit die Middleware erreichbar ist.
"""

import json
import sys
import urllib.request
import uuid
from pathlib import Path

MIDDLEWARE = "http://localhost:8181/plentysystems"
HIER = Path(__file__).parent
CDN = "https://cdn02.plentymarkets.com/f05ilw2rfpls/frontend/2021_Seite"

INK = "#1A1A1A"
GRAU = "#F3F3F3"
SAND = "#EFE7DC"


def uid():
    return str(uuid.uuid4())


def textcard(html, *, title="", pretitle="", subtitle="", align="left", color=INK,
             bg="", pad=(0, 0, 0, 0), button=None, full_width=False, slot=None):
    block = {
        "name": "TextCard",
        "type": "content",
        "meta": {"uuid": uid(), "isGlobalTemplate": False},
        "content": {
            "text": {
                "pretitle": pretitle,
                "title": title,
                "subtitle": subtitle,
                "htmlDescription": html,
                "textAlignment": align,
                "color": color,
            },
            "button": button or {"label": "", "link": "", "variant": "primary"},
            "layout": {
                "backgroundColor": bg,
                "paddingTop": pad[0],
                "paddingBottom": pad[1],
                "paddingLeft": pad[2],
                "paddingRight": pad[3],
                "fullWidth": full_width,
            },
        },
    }
    if slot is not None:
        block["parent_slot"] = slot
    return block


def bild(url, alt, link, slot, ratio="7 / 10"):
    return {
        "name": "Image",
        "type": "content",
        "meta": {"uuid": uid()},
        "parent_slot": slot,
        "content": {
            "image": {
                "wideScreen": url,
                "desktop": url,
                "tablet": url,
                "mobile": url,
                "alt": alt,
                "imageAlignment": "left",
                "fillMode": "fill",
                "aspectRatio": ratio,
                "linktarget": link,
            },
            "text": {"textOverlay": "", "textOverlayColor": "", "textOverlayAlignY": "center", "textOverlayAlignX": "center"},
            "button": {"label": "", "link": "", "variant": "primary"},
            "layout": {"paddingTop": 0, "paddingBottom": 0, "paddingLeft": 0, "paddingRight": 0, "fullWidth": False},
        },
    }


def produktslider(kategorie_id, titel, link, linktext):
    return {
        "name": "ProductRecommendedProducts",
        "type": "content",
        "meta": {"uuid": uid(), "isGlobalTemplate": False},
        "content": {
            "source": {"type": "category", "categoryId": str(kategorie_id), "itemId": "", "crossSellingRelation": "Similar"},
            "text": {
                "pretitle": "",
                "title": titel,
                "subtitle": "",
                "htmlDescription": f"<p><a class='underline' href='{link}'>{linktext}</a></p>",
                "color": INK,
                "textAlignment": "left",
            },
            "layout": {"fullWidth": False},
        },
    }


def kopfbereich():
    hinweis = {
        "name": "AnnouncementBar",
        "type": "content",
        "meta": {"uuid": uid(), "isGlobalTemplate": True},
        "configuration": {"visible": True},
        "content": {
            "backgroundColor": GRAU,
            "text": "Lieferung in 1–2 Werktagen · 60 Tage Rückgabe",
        },
    }
    leiste = {
        "name": "UtilityBar",
        "type": "content",
        "meta": {"uuid": "de5d09dd-f462-42c5-b5f1-456c570cea7e", "isGlobalTemplate": True},
        "content": {
            "layout": {"paddingTop": 14, "paddingBottom": 14, "paddingLeft": 40, "paddingRight": 40},
            "sectionOrder": {"sections": ["logo", "search", "actions"]},
            "sectionVisibility": {"logo": True, "search": True, "actions": True},
            "color": {"iconColor": INK, "backgroundColor": "#FFFFFF"},
            "search": {"displayMode": "full"},
            "actions": {
                "order": ["wishlist", "cart", "account", "language"],
                "visibility": {"language": False, "wishlist": True, "cart": True, "account": True},
            },
        },
    }
    navigation = {
        "name": "Navigation",
        "type": "content",
        "meta": {"uuid": "31877c7b-a5b6-4f4e-a970-90525d10b494", "isGlobalTemplate": True},
        "content": {
            "layout": {"paddingTop": 6, "paddingBottom": 6, "paddingLeft": 28, "paddingRight": 28},
            "text": {"textAlignment": "left"},
            "color": {"backgroundColor": "#FFFFFF", "textColor": INK, "hoverBackgroundColor": GRAU},
        },
    }
    return {
        "name": "HeaderContainer",
        "type": "structure",
        "meta": {"uuid": "ae0a2866-73f1-448d-a408-dbca97359a91", "isGlobalTemplate": True},
        "content": [hinweis, leiste, navigation],
        "configuration": {"visible": True, "layout": {"sticky": False}},
    }


def startseite():
    einstieg = textcard(
        "<p>Wide Leg, Straight und Skinny von ONLY, Mavi, Noisy May und Tom Tailor. "
        "Heute bestellt, in 1–2 Tagen bei dir.</p>"
        "<p><a class='underline' href='/herrenmode/jeans'>Jeans für Herren</a></p>",
        pretitle="HERBST / WINTER 2026",
        title="Neue Jeans für Damen",
        bg=SAND,
        pad=(48, 48, 24, 24),
        button={"label": "Jetzt entdecken", "link": "/damenmode/jeans", "variant": "primary"},
    )

    kacheln = {
        "name": "MultiGrid",
        "type": "structure",
        "meta": {"uuid": uid(), "isGlobalTemplate": False},
        "configuration": {
            "visible": True,
            "columnWidths": [3, 3, 3, 3],
            "columnWidthsTablet": [6, 6, 6, 6],
            "columnWidthsMobile": [6, 6, 6, 6],
            "layout": {"gap": "M", "marginTop": 32, "marginBottom": 0, "backgroundColor": "transparent"},
        },
        "content": [
            bild(f"{CDN}/denim_Kopie.jpg", "Jeansjacken für Damen", "/damenmode/jacken/jeansjacken", 0),
            bild(f"{CDN}/eleg_Kopie.jpg", "Hosen in Lederoptik", "/damenmode/hosen/lederoptik", 1),
            bild(f"{CDN}/chino_Kopie.jpg", "Chinos für Herren", "/herrenmode/hosen/chinos", 2),
            bild(f"{CDN}/shirtss_Kopie.jpg", "T-Shirts für Herren", "/herrenmode/oberteile/t-shirts", 3),
        ],
    }

    marken = textcard(
        "<p>"
        + " · ".join(
            f"<a href='/search?term={m.replace(' ', '+').replace('&', '%26')}'>{m}</a>"
            for m in ["ONLY", "Jack & Jones", "Vero Moda", "Tom Tailor", "Mavi", "Noisy May", "JDY", "Only & Sons", "!Solid"]
        )
        + "</p>",
        title="Unsere Marken",
        align="center",
        bg=GRAU,
        pad=(40, 40, 24, 24),
    )

    service = {
        "name": "MultiGrid",
        "type": "structure",
        "meta": {"uuid": uid(), "isGlobalTemplate": False},
        "configuration": {
            "visible": True,
            "columnWidths": [3, 3, 3, 3],
            "columnWidthsTablet": [6, 6, 6, 6],
            "columnWidthsMobile": [6, 6, 6, 6],
            "layout": {"gap": "L", "marginTop": 40, "marginBottom": 40, "backgroundColor": "transparent"},
        },
        "content": [
            textcard("<p><strong>Versand mit DHL</strong><br>4,90 € innerhalb Deutschlands</p>", slot=0),
            textcard("<p><strong>Lieferung in 1–2 Tagen</strong><br>Versand bis 14 Uhr am selben Tag</p>", slot=1),
            textcard("<p><strong>Sicher bezahlen</strong><br>PayPal, SEPA-Lastschrift oder giropay</p>", slot=2),
            textcard("<p><strong>60 Tage Rückgaberecht</strong><br>Service aus Deutschland</p>", slot=3),
        ],
    }

    newsletter = {
        "name": "NewsletterSubscribe",
        "type": "content",
        "meta": {"uuid": uid(), "isGlobalTemplate": False},
        "content": {
            "text": {
                "bgColor": GRAU,
                "title": "Newsletter",
                "htmlDescription": "Neuheiten und Aktionen zuerst erfahren.",
            },
            "input": {"displayNameInput": False, "nameIsRequired": False},
            "button": {"label": "Anmelden"},
            "settings": {"emailFolderId": 1},
        },
    }

    return [
        einstieg,
        kacheln,
        produktslider(44, "Neu bei Damen", "/damenmode", "Alle Damen-Artikel"),
        produktslider(16, "Neu bei Herren", "/herrenmode", "Alle Herren-Artikel"),
        produktslider(216, "Sale – bis zu −60 %", "/sale-und-outlet", "Zum Sale"),
        marken,
        service,
        newsletter,
    ]


def fussbereich():
    def spalte(slot, html, button=None):
        return textcard(html, slot=slot, color="", button=button)

    def ueberschrift(text):
        return f'<h2 data-heading-variant="footer"><span style="font-size: 1rem;">{text}</span></h2>'

    def link(href, text):
        return (f'<p><a rel="noopener noreferrer nofollow" href="{href}">'
                f'<span style="font-size: 0.875rem">{text}</span></a></p>')

    def zeile(text):
        return f'<p><span style="font-size: 0.875rem">{text}</span></p>'

    raster = {
        "name": "MultiGrid",
        "type": "structure",
        "meta": {"uuid": "1ba51225-8b50-4396-81a8-29f3cf8c1d9e", "isGlobalTemplate": False},
        "configuration": {
            "visible": True,
            "columnWidths": [3, 3, 3, 3],
            "columnWidthsTablet": [6, 6, 6, 6],
            "columnWidthsMobile": [6, 6, 6, 6],
            "layout": {"gap": "XL", "marginTop": 0, "marginBottom": 32, "backgroundColor": "transparent"},
        },
        "content": [
            spalte(0, ueberschrift("Rechtliches")
                   + link("/terms-and-conditions", "AGB")
                   + link("/legal-disclosure", "Impressum")
                   + link("/privacy-policy", "Datenschutzerklärung")
                   + link("/declaration-of-accessibility", "Barrierefreiheitserklärung")
                   + link("/cancellation-rights", "Widerrufsrecht")),
            spalte(1, ueberschrift("Kundenservice")
                   + link("/contact", "Kontakt")
                   + link("/shipping", "Versand")
                   + link("/register", "Registrieren")
                   + zeile("Telefon 06241 / 5003701")),
            spalte(2, ueberschrift("Bezahlen")
                   + zeile("PayPal")
                   + zeile("SEPA-Lastschrift")
                   + zeile("giropay")),
            spalte(3, ueberschrift("Unsere Vorteile")
                   + zeile("Versand mit DHL: 4,90 €")
                   + zeile("Lieferung in 1–2 Tagen")
                   + zeile("60 Tage Rückgaberecht"),
                   button={"label": "Vertrag widerrufen", "link": "/cancellation-form", "variant": "secondary"}),
        ],
    }
    copyright_ = textcard(
        '<p><span style="font-size: 0.875rem;">© Arizona Shopping 2026</span></p>',
        align="right", color="#B3B3B3", bg=INK, pad=(16, 16, 40, 40), full_width=True,
    )
    copyright_["meta"]["uuid"] = "693bae2a-1441-4530-be3d-01913d371e3d"
    return {
        "name": "FooterContainer",
        "type": "structure",
        "meta": {"uuid": "8b237adc-3c03-42f6-9fb2-0c4d2b7d85b5", "isGlobalTemplate": True},
        "content": [raster, copyright_],
        "configuration": {"visible": True, "colors": {"background": GRAU, "text": INK}},
    }


def middleware(methode, params):
    req = urllib.request.Request(
        f"{MIDDLEWARE}/{methode}",
        data=json.dumps([params]).encode(),
        headers={"Content-Type": "application/json", "Cookie": "vsf-locale=de", "Origin": "http://localhost:3000"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        return r.status, json.loads(r.read() or b"{}")


def main():
    bloecke = [kopfbereich(), *startseite(), fussbereich()]
    (HIER / "startseite_bloecke.json").write_text(json.dumps(bloecke, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{len(bloecke)} Bloecke vorbereitet: " + ", ".join(b["name"] for b in bloecke))

    if sys.argv[1:] != ["speichern"]:
        print("Testlauf - nichts gespeichert. Zum Speichern: python3 arizona/startseite_bloecke.py speichern")
        return

    status, antwort = middleware("doSaveBlocksWithGlobalBlocks", {
        "identifier": "index",
        "entityType": "immutable",
        "blocks": json.dumps(bloecke, ensure_ascii=False),
        "enableGlobalBlocks": True,
    })
    print("Speichern:", status, str(antwort)[:300])

    status, kontrolle = middleware("getBlocksWithGlobalBlocks", {
        "identifier": "index", "type": "immutable", "enableGlobalBlocks": True,
    })
    daten = kontrolle.get("data", {})
    print("Kontrolle:", status,
          "Kopf:", [b["name"] for b in (daten.get("HeaderContainer") or {}).get("content", [])],
          "Seite:", [b["name"] for b in daten.get("blocks", [])],
          "Fuss:", (daten.get("Footer") or {}).get("name"))


if __name__ == "__main__":
    main()
