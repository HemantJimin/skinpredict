# -----------------------------------
# recommendation_engine.py
# Rule-based intelligence (NO ML here)
# -----------------------------------

def predict_skin_problem(skin_type, skin_issue):
    if skin_issue == "Acne":
        return "Acne-prone skin"
    if skin_issue == "Pigmentation":
        return "Hyperpigmentation"
    if skin_issue == "Dryness":
        return "Dry & dehydrated skin"
    if skin_issue == "Sensitivity":
        return "Sensitive skin"
    return "Normal skin"


def deduce_skin_condition(skin_problem):
    mapping = {
        "Acne-prone skin": "Acne Vulgaris (mild)",
        "Hyperpigmentation": "Melasma / Dark spots",
        "Dry & dehydrated skin": "Eczema-prone skin",
        "Sensitive skin": "Irritated or allergic skin",
        "Normal skin": "Healthy skin"
    }
    return mapping.get(skin_problem, "General skin condition")


def recommend_foods(skin_problem):
    if skin_problem == "Hyperpigmentation":
        return (
            ["Vitamin C foods", "Antioxidants"],
            ["Processed food", "Excess sugar"]
        )
    if skin_problem == "Acne-prone skin":
        return (
            ["Fruits", "Green vegetables", "Zinc-rich foods"],
            ["Junk food", "Oily food", "Sugar"]
        )
    if skin_problem == "Dry & dehydrated skin":
        return (
            ["Nuts", "Seeds", "Healthy oils"],
            ["Alcohol", "Caffeine"]
        )
    return (
        ["Balanced diet"],
        ["Excess sugar"]
    )


def select_treatment_method(trust_ai, ayurveda_awareness):
    if ayurveda_awareness >= 4:
        return "Ayurvedic"
    if trust_ai >= 4:
        return "AI-assisted"
    return "Modern / Chemical"


def lifestyle_actions():
    return [
        "Maintain balanced diet",
        "Get enough sleep",
        "Reduce stress"
    ]


def product_composition(ayurveda_awareness, product_used):
    if ayurveda_awareness >= 4 or product_used in ["Herbal", "Natural"]:
        return {
            "Ayurvedic": "70%",
            "Herbal": "30%",
            "Chemical": "0%"
        }
    return {
        "Ayurvedic": "40%",
        "Herbal": "30%",
        "Chemical": "30%"
    }
