import pandas as pd
import joblib
from sklearn.linear_model import LinearRegression
from sales.models import Sale
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error

sales = Sale.objects.values(
    'sale_date', 'quantity', 'total_amount')
df = pd.DataFrame(sales)
print(df)

df['sale_date'] = pd.to_datetime(df['sale_date'])
df['day'] = df['sale_date'].dt.day
df['month'] = df['sale_date'].dt.month
df['year'] = df['sale_date'].dt.year

X = df[['day', 'month', 'year']]
y = df['quantity']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, 
    test_size=0.2,
    random_state=42
)

model = LinearRegression()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print(y_pred)

mae = mean_absolute_error(y_test, y_pred)
print("Mean Absolute Error:", mae)

joblib.dump(model, 'ml/sales_model.pkl')
print("Model saved successfully!")