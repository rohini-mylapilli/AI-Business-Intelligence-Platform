from django.db import models

class Product(models.Model):
    class Category(models.TextChoices):
        ELECTRONICS = 'ELECTRONICS', 'Electronics'
        CLOTHING = 'CLOTHING', 'Clothing'
        GROCERY = 'GROCERY', 'Grocery'
        FURNITURE = 'FURNITURE', 'Furniture'
        OTHERS = 'OTHERS', 'Others'
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=20, choices=Category.choices)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name