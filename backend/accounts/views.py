from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, status

from .models import User
from .serializers import UserSerializer
from .permissions import IsAdmin


# =========================================================
# USER LIST
# =========================================================

class UserListView(generics.ListCreateAPIView):

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]


# =========================================================
# USER DETAIL
# =========================================================

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]


# =========================================================
# CURRENT USER PROFILE
# =========================================================

class ProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        serializer = UserSerializer(request.user)

        return Response(serializer.data)


# =========================================================
# ADMIN ONLY TEST
# =========================================================

class AdminOnlyView(APIView):

    permission_classes = [IsAdmin]

    def get(self, request):

        return Response({
            "message": "Admin access successful.",
            "username": request.user.username,
            "role": "Admin"
        })


# =========================================================
# CHANGE PASSWORD
# =========================================================

class ChangePasswordView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        user = request.user

        current_password = request.data.get(
            "current_password"
        )

        new_password = request.data.get(
            "new_password"
        )

        confirm_password = request.data.get(
            "confirm_password"
        )

        # ---------------------------------------------
        # CHECK ALL FIELDS
        # ---------------------------------------------

        if not current_password or not new_password or not confirm_password:

            return Response(
                {
                    "detail": "All fields are required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ---------------------------------------------
        # CHECK CURRENT PASSWORD
        # ---------------------------------------------

        if not user.check_password(current_password):

            return Response(
                {
                    "detail": "Current password is incorrect."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ---------------------------------------------
        # CHECK PASSWORD CONFIRMATION
        # ---------------------------------------------

        if new_password != confirm_password:

            return Response(
                {
                    "detail": "New passwords do not match."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ---------------------------------------------
        # PASSWORD LENGTH
        # ---------------------------------------------

        if len(new_password) < 8:

            return Response(
                {
                    "detail":
                    "Password must be at least 8 characters."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ---------------------------------------------
        # SAME PASSWORD CHECK
        # ---------------------------------------------

        if current_password == new_password:

            return Response(
                {
                    "detail":
                    "New password must be different from current password."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ---------------------------------------------
        # SAVE PASSWORD
        # ---------------------------------------------

        user.set_password(new_password)

        user.save()

        return Response(
            {
                "message":
                "Password changed successfully."
            },
            status=status.HTTP_200_OK
        )