import pandas as pd

df = pd.read_csv("diabetes.csv")

print("Number of rows and columns:", df.shape)
print(df.head())

print("\nHow many diabetic vs not diabetic:")
print(df["Outcome"].value_counts())


print("\nChecking for zero values in important columns:")
cols = ["Glucose", "BloodPressure", "BMI", "Insulin"]
for col in cols:
    zeros = (df[col] == 0).sum()
    print(col, "has", zeros, "zeros")


    import numpy as np

cols_to_fix = ["Glucose", "BloodPressure", "BMI", "Insulin"]
for col in cols_to_fix:
    df[col] = df[col].replace(0, np.nan)
    df[col] = df[col].fillna(df[col].median())

print("\nZero values after fix:")
for col in cols_to_fix:
    zeros = (df[col] == 0).sum()
    print(col, "has", zeros, "zeros")