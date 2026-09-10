
import joblib

from django.db import transaction

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError

from .models import Sale
from .serializers import SaleSerializer
from products.models import Product

from accounts.permissions import IsAdminOrManager, IsAdmin


class SaleListCreateView(generics.ListCreateAPIView):

    serializer_class = SaleSerializer

    def get_queryset(self):

        user = self.request.user

        if user.role in ["ADMIN", "MANAGER"]:
            return Sale.objects.all().order_by("-sale_date")

        if user.role == "EMPLOYEE":
            return Sale.objects.filter(
                sold_by=user
            ).order_by("-sale_date")

        return Sale.objects.none()


    def get_permissions(self):

        return [IsAuthenticated()]


    @transaction.atomic
    def perform_create(self, serializer):

        product_id = self.request.data.get("product")

        if not product_id:
            raise ValidationError({
                "product": "Product is required."
            })


        try:
            quantity = int(
                self.request.data.get("quantity", 0)
            )

        except (TypeError, ValueError):
            raise ValidationError({
                "quantity": "Quantity must be a valid number."
            })


        if quantity <= 0:
            raise ValidationError({
                "quantity": "Quantity must be greater than zero."
            })


        customer_name = self.request.data.get(
            "customer_name"
        )

        if not customer_name:
            raise ValidationError({
                "customer_name": "Customer name is required."
            })


        customer_phone = self.request.data.get(
            "customer_phone"
        )

        if not customer_phone:
            raise ValidationError({
                "customer_phone": "Customer phone is required."
            })


        try:
            product = Product.objects.select_for_update().get(
                id=product_id
            )

        except Product.DoesNotExist:
            raise ValidationError({
                "product": "Product does not exist."
            })


        if product.stock < quantity:
            raise ValidationError({
                "quantity":
                f"Only {product.stock} items are available."
            })


        total_amount = product.price * quantity


        product.stock -= quantity

        product.save(
            update_fields=["stock"]
        )


        serializer.save(
            sold_by=self.request.user,
            customer_name=customer_name,
            customer_phone=customer_phone,
            total_amount=total_amount
        )


class SaleDetailView(generics.RetrieveUpdateDestroyAPIView):

    serializer_class = SaleSerializer


    def get_queryset(self):

        user = self.request.user

        if user.role in ["ADMIN", "MANAGER"]:
            return Sale.objects.all()

        if user.role == "EMPLOYEE":
            return Sale.objects.filter(
                sold_by=user
            )

        return Sale.objects.none()


    def get_permissions(self):

        if self.request.method == "DELETE":
            return [IsAdmin()]

        if self.request.method in ["PUT", "PATCH"]:
            return [IsAdminOrManager()]

        return [IsAuthenticated()]


class SalesPredictionView(APIView):

    permission_classes = [IsAdminOrManager]


    def post(self, request):

        day = request.data.get("day")
        month = request.data.get("month")
        year = request.data.get("year")


        model = joblib.load(
            "ml/sales_model.pkl"
        )


        prediction = model.predict([
            [day, month, year]
        ])


        return Response({
            "predicted_sales":
            round(float(prediction[0]), 2)
        })