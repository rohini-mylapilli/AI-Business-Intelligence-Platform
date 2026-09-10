from rest_framework import serializers
from .models import DailyReport


class DailyReportSerializer(serializers.ModelSerializer):

    employee_name = serializers.CharField(
        source="employee.username",
        read_only=True
    )

    class Meta:
        model = DailyReport

        fields = [
            "id",
            "employee",
            "employee_name",
            "report_date",
            "total_sales",
            "products_sold",
            "description",
            "status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "employee",
            "employee_name",
            "total_sales",
            "products_sold",
            "created_at",
            "updated_at",
        ]