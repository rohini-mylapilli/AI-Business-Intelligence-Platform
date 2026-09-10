from rest_framework import serializers
from .models import Sale


class SaleSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    category = serializers.CharField(source="product.category", read_only=True)
    sold_by_name = serializers.CharField(source="sold_by.username", read_only=True)

    class Meta:
        model = Sale
        fields = "__all__"