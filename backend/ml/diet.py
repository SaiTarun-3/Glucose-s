import random

# ── Vegetarian meals ──────────────────────────────
veg_diabetic = {
    "breakfast": [
        {"name": "Oats with almonds (Indian)", "calories": 300},
        {"name": "Moong dal chilla", "calories": 280},
        {"name": "Greek yogurt with berries", "calories": 250},
        {"name": "Vegetable upma", "calories": 270},
    ],
    "lunch": [
        {"name": "Brown rice with dal", "calories": 400},
        {"name": "Whole wheat roti with sabzi", "calories": 380},
        {"name": "Quinoa vegetable salad", "calories": 350},
        {"name": "Lentil soup with brown bread", "calories": 370},
    ],
    "dinner": [
        {"name": "Palak paneer with roti", "calories": 420},
        {"name": "Vegetable stir fry with tofu", "calories": 350},
        {"name": "Grilled paneer with salad", "calories": 380},
        {"name": "Mixed vegetable soup with bread", "calories": 300},
    ]
}

veg_normal = {
    "breakfast": [
        {"name": "Masala dosa with chutney", "calories": 450},
        {"name": "Poha with peanuts", "calories": 400},
        {"name": "Fruit smoothie with granola", "calories": 420},
        {"name": "Bread omelette (egg)", "calories": 380},
    ],
    "lunch": [
        {"name": "Rice with rajma curry", "calories": 600},
        {"name": "Pasta with tomato sauce", "calories": 550},
        {"name": "Paneer butter masala with naan", "calories": 650},
        {"name": "Chole with rice", "calories": 580},
    ],
    "dinner": [
        {"name": "Dal makhani with roti", "calories": 520},
        {"name": "Vegetable biryani", "calories": 580},
        {"name": "Mushroom curry with rice", "calories": 500},
        {"name": "Paneer wrap with salad", "calories": 480},
    ]
}

# ── Non-Vegetarian meals ──────────────────────────
nonveg_diabetic = {
    "breakfast": [
        {"name": "Boiled eggs with vegetables", "calories": 280},
        {"name": "Egg white omelette with toast", "calories": 260},
        {"name": "Chicken sandwich (whole wheat)", "calories": 320},
        {"name": "Greek yogurt with nuts", "calories": 250},
    ],
    "lunch": [
        {"name": "Grilled chicken salad", "calories": 400},
        {"name": "Fish curry with brown rice", "calories": 430},
        {"name": "Chicken soup with bread", "calories": 370},
        {"name": "Tandoori chicken with salad", "calories": 380},
    ],
    "dinner": [
        {"name": "Baked fish with steamed broccoli", "calories": 380},
        {"name": "Grilled chicken with quinoa", "calories": 420},
        {"name": "Egg curry with brown rice", "calories": 400},
        {"name": "Chicken stir fry with vegetables", "calories": 360},
    ]
}

nonveg_normal = {
    "breakfast": [
        {"name": "Chicken paratha with yogurt", "calories": 500},
        {"name": "Egg bhurji with toast", "calories": 420},
        {"name": "Omelette with bacon and toast", "calories": 480},
        {"name": "Chicken sandwich with juice", "calories": 450},
    ],
    "lunch": [
        {"name": "Chicken biryani", "calories": 700},
        {"name": "Fish and chips", "calories": 650},
        {"name": "Mutton curry with rice", "calories": 680},
        {"name": "Chicken pasta", "calories": 600},
    ],
    "dinner": [
        {"name": "Grilled salmon with rice", "calories": 580},
        {"name": "Butter chicken with naan", "calories": 650},
        {"name": "Prawn curry with rice", "calories": 560},
        {"name": "Chicken wrap with salad", "calories": 520},
    ]
}

print("Food database ready!")

def get_calorie_limit(bmi, activity):
    if bmi > 30:
        base = 1500  # high BMI — lower calories
    elif bmi > 25:
        base = 1800  # slightly overweight
    else:
        base = 2100  # normal BMI

    if activity == "active":
        base += 300  # burn more so can eat more

    return base

def generate_diet_plan(name, diabetic, veg, bmi, age, activity):
    # Pick the right food database
    if veg == "veg":
        meals = veg_diabetic if diabetic else veg_normal
    else:
        meals = nonveg_diabetic if diabetic else nonveg_normal

    calorie_limit = get_calorie_limit(bmi, activity)
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    print("\n" + "="*50)
    print(f"  7-Day Meal Plan for {name}")
    print(f"  Diabetic: {diabetic} | Diet: {veg} | BMI: {bmi}")
    print(f"  Age: {age} | Activity: {activity}")
    print(f"  Daily Calorie Target: {calorie_limit} kcal")
    print("="*50)

    for day in days:
        breakfast = random.choice(meals["breakfast"])
        lunch     = random.choice(meals["lunch"])
        dinner    = random.choice(meals["dinner"])
        total     = breakfast["calories"] + lunch["calories"] + dinner["calories"]

        print(f"\n📅 {day}")
        print(f"  🌅 Breakfast : {breakfast['name']} ({breakfast['calories']} cal)")
        print(f"  ☀️  Lunch     : {lunch['name']} ({lunch['calories']} cal)")
        print(f"  🌙 Dinner    : {dinner['name']} ({dinner['calories']} cal)")
        print(f"  🔥 Total     : {total} cal / {calorie_limit} cal target")

generate_diet_plan(
name     = "Ravi",
diabetic = True,
veg      = "veg",
bmi      = 28,
age      = 45,
activity = "sedentary"
)