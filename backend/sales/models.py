from django.db import models
from products.models import Product
from accounts.models import User


class Sale(models.Model):
    customer_name = models.CharField(max_length=100)
    customer_phone = models.CharField(max_length=15)
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="sales"
    )
    quantity = models.PositiveIntegerField()
    total_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )
    sold_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="sales"
    )
    sale_date = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.customer_name} - {self.product.name}"