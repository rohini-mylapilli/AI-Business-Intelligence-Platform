from django.db import models
from accounts.models import User


class DailyReport(models.Model):

    employee = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="daily_reports"
    )

    report_date = models.DateField()

    total_sales = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    products_sold = models.PositiveIntegerField(
        default=0
    )

    description = models.TextField(
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=[
            ("PENDING", "Pending"),
            ("SUBMITTED", "Submitted"),
            ("REVIEWED", "Reviewed"),
        ],
        default="SUBMITTED"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.employee.username} - {self.report_date}"