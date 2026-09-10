from collections import defaultdict

from django.db import transaction
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError

from .models import DailyReport
from .serializers import DailyReportSerializer
from .permissions import IsAdmin, IsAdminOrManager, IsEmployee

from sales.models import Sale


# ============================================================
# DAILY REPORT LIST + CREATE
# ============================================================

class DailyReportListCreateView(generics.ListCreateAPIView):

    serializer_class = DailyReportSerializer

    # --------------------------------------------------------
    # GET REPORTS
    # --------------------------------------------------------

    def get_queryset(self):

        user = self.request.user

        # Automatically create/update reports
        # from employee sales
        self.sync_reports_from_sales()

        # ADMIN
        if user.role == "ADMIN":

            return DailyReport.objects.all().order_by(
                "-report_date",
                "-id"
            )

        # MANAGER
        elif user.role == "MANAGER":

            return DailyReport.objects.all().order_by(
                "-report_date",
                "-id"
            )

        # EMPLOYEE
        elif user.role == "EMPLOYEE":

            return DailyReport.objects.filter(
                employee=user
            ).order_by(
                "-report_date",
                "-id"
            )

        # UNKNOWN ROLE
        return DailyReport.objects.none()

    # --------------------------------------------------------
    # PERMISSIONS
    # --------------------------------------------------------

    def get_permissions(self):

        if self.request.method == "POST":

            return [IsEmployee()]

        return [IsAuthenticated()]

    # --------------------------------------------------------
    # SYNC SALES → DAILY REPORTS
    # --------------------------------------------------------

    def sync_reports_from_sales(self):

        """
        Convert employee sales into daily reports.

        Example:

        Employee:
        Rahul

        Sales:
        ₹500  on 2026-09-04
        ₹700  on 2026-09-04
        ₹300  on 2026-09-05

        Reports created:

        Rahul | 2026-09-04 | ₹1200
        Rahul | 2026-09-05 | ₹300
        """

        # Get all sales
        sales = Sale.objects.select_related(
            "sold_by"
        ).order_by(
            "sale_date"
        )

        # Dictionary used to group sales
        # employee + date
        grouped_sales = defaultdict(
            lambda: {
                "total_sales": 0,
                "products_sold": 0,
            }
        )

        # ----------------------------------------------------
        # GROUP SALES
        # ----------------------------------------------------

        for sale in sales:

            # Safety check
            if not sale.sold_by:
                continue

            if not sale.sale_date:
                continue

            # Convert datetime → date
            report_date = sale.sale_date.date()

            # Create grouping key
            key = (
                sale.sold_by_id,
                report_date
            )

            # Add total sales amount
            grouped_sales[key]["total_sales"] += (
                sale.total_amount or 0
            )

            # Add quantity of products sold
            grouped_sales[key]["products_sold"] += (
                sale.quantity or 0
            )

        # ----------------------------------------------------
        # CREATE / UPDATE DAILY REPORTS
        # ----------------------------------------------------

        for (employee_id, report_date), data in grouped_sales.items():

            DailyReport.objects.update_or_create(

                employee_id=employee_id,

                report_date=report_date,

                defaults={
                    "total_sales": data["total_sales"],
                    "products_sold": data["products_sold"],
                    "status": "SUBMITTED",
                }
            )

    # --------------------------------------------------------
    # EMPLOYEE CREATE REPORT
    # --------------------------------------------------------

    def perform_create(self, serializer):

        user = self.request.user

        # Only employees can manually create reports
        if user.role != "EMPLOYEE":

            raise ValidationError(
                "Only employees can create reports."
            )

        report_date = self.request.data.get(
            "report_date"
        )

        if not report_date:

            raise ValidationError(
                {
                    "report_date":
                    "Report date is required."
                }
            )

        serializer.save(
            employee=user,
            report_date=report_date
        )


# ============================================================
# DAILY REPORT DETAIL
# ============================================================

class DailyReportDetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    serializer_class = DailyReportSerializer

    # --------------------------------------------------------
    # GET REPORT DETAIL
    # --------------------------------------------------------

    def get_queryset(self):

        user = self.request.user

        # ADMIN
        if user.role == "ADMIN":

            return DailyReport.objects.all()

        # MANAGER
        elif user.role == "MANAGER":

            return DailyReport.objects.all()

        # EMPLOYEE
        elif user.role == "EMPLOYEE":

            return DailyReport.objects.filter(
                employee=user
            )

        return DailyReport.objects.none()

    # --------------------------------------------------------
    # PERMISSIONS
    # --------------------------------------------------------

    def get_permissions(self):

        # Only ADMIN can delete
        if self.request.method == "DELETE":

            return [IsAdmin()]

        # ADMIN + MANAGER can update
        elif self.request.method in [
            "PUT",
            "PATCH"
        ]:

            return [IsAdminOrManager()]

        # Everyone authenticated can view
        return [IsAuthenticated()]