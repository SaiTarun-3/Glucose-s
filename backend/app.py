from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import random

app = Flask(__name__)
CORS(app)

# Load the ML model and scaler
model  = joblib.load("ml/model.pkl")
scaler = joblib.load("ml/scaler.pkl")

# ── Diet plan data ────────────────────────────────
veg_diabetic = {
    "breakfast": [
        {"name": "Oats with almonds", "calories": 300},
        {"name": "Moong dal chilla", "calories": 280},
        {"name": "Vegetable upma", "calories": 270},
    ],
    "lunch": [
        {"name": "Brown rice with dal", "calories": 400},
        {"name": "Whole wheat roti with sabzi", "calories": 380},
        {"name": "Lentil soup with brown bread", "calories": 370},
    ],
    "dinner": [
        {"name": "Palak paneer with roti", "calories": 420},
        {"name": "Grilled paneer with salad", "calories": 380},
        {"name": "Mixed vegetable soup with bread", "calories": 300},
    ]
}

veg_normal = {
    "breakfast": [
        {"name": "Masala dosa with chutney", "calories": 450},
        {"name": "Poha with peanuts", "calories": 400},
        {"name": "Fruit smoothie with granola", "calories": 420},
    ],
    "lunch": [
        {"name": "Rice with rajma curry", "calories": 600},
        {"name": "Pasta with tomato sauce", "calories": 550},
        {"name": "Paneer butter masala with naan", "calories": 650},
    ],
    "dinner": [
        {"name": "Dal makhani with roti", "calories": 520},
        {"name": "Vegetable biryani", "calories": 580},
        {"name": "Mushroom curry with rice", "calories": 500},
    ]
}

nonveg_diabetic = {
    "breakfast": [
        {"name": "Boiled eggs with vegetables", "calories": 280},
        {"name": "Egg white omelette with toast", "calories": 260},
        {"name": "Greek yogurt with nuts", "calories": 250},
    ],
    "lunch": [
        {"name": "Grilled chicken salad", "calories": 400},
        {"name": "Fish curry with brown rice", "calories": 430},
        {"name": "Tandoori chicken with salad", "calories": 380},
    ],
    "dinner": [
        {"name": "Baked fish with broccoli", "calories": 380},
        {"name": "Grilled chicken with quinoa", "calories": 420},
        {"name": "Chicken stir fry with vegetables", "calories": 360},
    ]
}

nonveg_normal = {
    "breakfast": [
        {"name": "Chicken paratha with yogurt", "calories": 500},
        {"name": "Egg bhurji with toast", "calories": 420},
        {"name": "Omelette with toast", "calories": 480},
    ],
    "lunch": [
        {"name": "Chicken biryani", "calories": 700},
        {"name": "Mutton curry with rice", "calories": 680},
        {"name": "Chicken pasta", "calories": 600},
    ],
    "dinner": [
        {"name": "Grilled salmon with rice", "calories": 580},
        {"name": "Butter chicken with naan", "calories": 650},
        {"name": "Chicken wrap with salad", "calories": 520},
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
    for day in days:
        breakfast = random.choice(meals["breakfast"])
        lunch     = random.choice(meals["lunch"])
        dinner    = random.choice(meals["dinner"])
        total     = breakfast["calories"] + lunch["calories"] + dinner["calories"]
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