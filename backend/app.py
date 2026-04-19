from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import random

app = Flask(__name__)
CORS(app)

# Load the ML model and scaler
import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model = joblib.load(os.path.join(BASE_DIR, "ml", "model.pkl"))
scaler = joblib.load(os.path.join(BASE_DIR, "ml", "scaler.pkl"))
scaler = joblib.load("ml/scaler.pkl")

# ── Diet plan data ────────────────────────────────
veg_diabetic = {
    "breakfast": [
        {"name": "Oats with almonds", "calories": 300},
        {"name": "Moong dal chilla", "calories": 280},
        {"name": "Vegetable upma", "calories": 270},
        {"name": "Greek yogurt with berries", "calories": 250},
        {"name": "Besan cheela with chutney", "calories": 260},
        {"name": "Ragi dosa with sambar", "calories": 290},
        {"name": "Poha with peanuts", "calories": 280},
    ],
    "lunch": [
        {"name": "Brown rice with dal", "calories": 400},
        {"name": "Whole wheat roti with sabzi", "calories": 380},
        {"name": "Lentil soup with brown bread", "calories": 370},
        {"name": "Quinoa vegetable salad", "calories": 350},
        {"name": "Bajra roti with methi sabzi", "calories": 360},
        {"name": "Jowar roti with dal", "calories": 370},
        {"name": "Vegetable daliya khichdi", "calories": 340},
    ],
    "dinner": [
        {"name": "Palak paneer with roti", "calories": 420},
        {"name": "Grilled paneer with salad", "calories": 380},
        {"name": "Mixed vegetable soup with bread", "calories": 300},
        {"name": "Tofu stir fry with brown rice", "calories": 360},
        {"name": "Methi thepla with curd", "calories": 340},
        {"name": "Vegetable daliya with raita", "calories": 320},
        {"name": "Spinach soup with multigrain toast", "calories": 280},
    ]
}

veg_normal = {
    "breakfast": [
        {"name": "Masala dosa with chutney", "calories": 450},
        {"name": "Poha with peanuts", "calories": 400},
        {"name": "Fruit smoothie with granola", "calories": 420},
        {"name": "Bread omelette with juice", "calories": 380},
        {"name": "Aloo paratha with curd", "calories": 460},
        {"name": "Idli sambar with chutney", "calories": 380},
        {"name": "Upma with coconut chutney", "calories": 350},
    ],
    "lunch": [
        {"name": "Rice with rajma curry", "calories": 600},
        {"name": "Pasta with tomato sauce", "calories": 550},
        {"name": "Paneer butter masala with naan", "calories": 650},
        {"name": "Chole with rice", "calories": 580},
        {"name": "Vegetable biryani with raita", "calories": 620},
        {"name": "Pav bhaji with butter", "calories": 560},
        {"name": "Dal makhani with jeera rice", "calories": 590},
    ],
    "dinner": [
        {"name": "Dal makhani with roti", "calories": 520},
        {"name": "Vegetable biryani", "calories": 580},
        {"name": "Mushroom curry with rice", "calories": 500},
        {"name": "Paneer wrap with salad", "calories": 480},
        {"name": "Palak paneer with paratha", "calories": 540},
        {"name": "Mix veg curry with naan", "calories": 510},
        {"name": "Kadai paneer with roti", "calories": 530},
    ]
}

nonveg_diabetic = {
    "breakfast": [
        {"name": "Boiled eggs with vegetables", "calories": 280},
        {"name": "Egg white omelette with toast", "calories": 260},
        {"name": "Greek yogurt with nuts", "calories": 250},
        {"name": "Chicken sandwich whole wheat", "calories": 320},
        {"name": "Scrambled eggs with spinach", "calories": 270},
        {"name": "Egg bhurji with brown toast", "calories": 290},
        {"name": "Poached eggs with avocado", "calories": 300},
    ],
    "lunch": [
        {"name": "Grilled chicken salad", "calories": 400},
        {"name": "Fish curry with brown rice", "calories": 430},
        {"name": "Tandoori chicken with salad", "calories": 380},
        {"name": "Chicken soup with bread", "calories": 370},
        {"name": "Grilled fish with vegetables", "calories": 360},
        {"name": "Egg curry with brown rice", "calories": 400},
        {"name": "Chicken tikka with mint chutney", "calories": 350},
    ],
    "dinner": [
        {"name": "Baked fish with broccoli", "calories": 380},
        {"name": "Grilled chicken with quinoa", "calories": 420},
        {"name": "Chicken stir fry with vegetables", "calories": 360},
        {"name": "Steamed fish with brown rice", "calories": 370},
        {"name": "Chicken soup with multigrain bread", "calories": 340},
        {"name": "Grilled prawns with salad", "calories": 350},
        {"name": "Baked chicken with sweet potato", "calories": 400},
    ]
}

nonveg_normal = {
    "breakfast": [
        {"name": "Chicken paratha with yogurt", "calories": 500},
        {"name": "Egg bhurji with toast", "calories": 420},
        {"name": "Omelette with bacon and toast", "calories": 480},
        {"name": "Chicken sandwich with juice", "calories": 450},
        {"name": "Keema paratha with curd", "calories": 520},
        {"name": "Egg dosa with sambar", "calories": 430},
        {"name": "Boiled eggs with paratha", "calories": 460},
    ],
    "lunch": [
        {"name": "Chicken biryani", "calories": 700},
        {"name": "Mutton curry with rice", "calories": 680},
        {"name": "Chicken pasta", "calories": 600},
        {"name": "Fish and chips", "calories": 650},
        {"name": "Prawn biryani with raita", "calories": 720},
        {"name": "Butter chicken with naan", "calories": 680},
        {"name": "Chicken fried rice", "calories": 620},
    ],
    "dinner": [
        {"name": "Grilled salmon with rice", "calories": 580},
        {"name": "Butter chicken with naan", "calories": 650},
        {"name": "Prawn curry with rice", "calories": 560},
        {"name": "Chicken wrap with salad", "calories": 520},
        {"name": "Mutton rogan josh with roti", "calories": 600},
        {"name": "Fish tikka with mint chutney", "calories": 480},
        {"name": "Chicken keema with paratha", "calories": 560},
    ]
}
def generate_diet(diabetic, veg, bmi, activity):
    if veg == "veg":
        meals = veg_diabetic if diabetic else veg_normal
    else:
        meals = nonveg_diabetic if diabetic else nonveg_normal

    if bmi > 30:
        calorie_limit = 1500
    elif bmi > 25:
        calorie_limit = 1800
    else:
        calorie_limit = 2100

    if activity == "active":
        calorie_limit += 300

    days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
    plan = []

    last_breakfast = last_lunch = last_dinner = None

    for day in days:
        # Pick breakfast - never repeat previous day
        b_options = [m for m in meals["breakfast"] if m["name"] != last_breakfast]
        breakfast = random.choice(b_options)
        last_breakfast = breakfast["name"]

        # Pick lunch - never repeat previous day
        l_options = [m for m in meals["lunch"] if m["name"] != last_lunch]
        lunch = random.choice(l_options)
        last_lunch = lunch["name"]

        # Pick dinner - never repeat previous day
        d_options = [m for m in meals["dinner"] if m["name"] != last_dinner]
        dinner = random.choice(d_options)
        last_dinner = dinner["name"]

        total = breakfast["calories"] + lunch["calories"] + dinner["calories"]
        plan.append({
            "day": day,
            "breakfast": breakfast,
            "lunch": lunch,
            "dinner": dinner,
            "total_calories": total,
            "calorie_limit": calorie_limit
        })
    return plan

# ── Routes ────────────────────────────────────────
@app.route("/")
def home():
    return jsonify({"message": "Diabetes API is running!"})

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    features = np.array([[
        data["pregnancies"],
        data["glucose"],
        data["bloodpressure"],
        data["skinthickness"],
        data["insulin"],
        data["bmi"],
        data["dpf"],
        data["age"]
    ]])

    features_scaled = scaler.transform(features)
    prediction      = model.predict(features_scaled)[0]
    probability     = model.predict_proba(features_scaled)[0]

    result     = "Diabetic" if prediction == 1 else "Not Diabetic"
    confidence = round(probability[1] * 100, 2)

    diet_plan = generate_diet(
        diabetic = prediction == 1,
        veg      = data.get("veg", "veg"),
        bmi      = data["bmi"],
        activity = data.get("activity", "sedentary")
    )

    return jsonify({
        "prediction": result,
        "confidence": confidence,
        "diet_plan":  diet_plan
    })

if __name__ == "__main__":
    app.run(debug=True)