from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from django.db.models import Sum
from django.contrib.auth import get_user_model

from products.models import Product
from sales.models import Sale
from reports.models import DailyReport

from .permissions import IsAdminOrManager


User = get_user_model()


class DashboardView(APIView):

    permission_classes = [IsAdminOrManager]

    def get(self, request):

        total_users = User.objects.count()

        total_products = Product.objects.count()

        total_sales = Sale.objects.count()

        total_reports = DailyReport.objects.count()

        total_revenue = (
            Sale.objects.aggregate(
                total=Sum('total_amount')
            )['total'] or 0
        )

        return Response({

            "total_users": total_users,

            "total_products": total_products,

            "total_sales": total_sales,

            "total_reports": total_reports,

            "total_revenue": float(total_revenue)

        })


class SalesByCategoryView(APIView):

    permission_classes = [IsAdminOrManager]

    def get(self, request):

        data = (
            Sale.objects
            .values('product__category')
            .annotate(
                total_sales=Sum('quantity')
            )
            .order_by('-total_sales')
        )

        return Response(data)


class TopSellingProductsView(APIView):

    permission_classes = [IsAdminOrManager]

    def get(self, request):

        data = (
            Sale.objects
            .values('product__name')
            .annotate(
                total_quantity=Sum('quantity')
            )
            .order_by('-total_quantity')[:5]
        )

        return Response(data)


class SalesTrendView(APIView):

    permission_classes = [IsAdminOrManager]

    def get(self, request):

        data = (
            Sale.objects
            .values('sale_date__date')
            .annotate(
                total_sales=Sum('quantity'),
                total_revenue=Sum('total_amount')
            )
            .order_by('sale_date__date')
        )

        return Response(data)