from django.urls import path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

from .views import (
    UserListView,
    UserDetailView,
    ProfileView,
    AdminOnlyView,
    ChangePasswordView,
)


urlpatterns = [

    path(
        'login/',
        TokenObtainPairView.as_view(),
        name='token_obtain_pair'
    ),

    path(
        'refresh/',
        TokenRefreshView.as_view(),
        name='token_refresh'
    ),

    path(
        'users/',
        UserListView.as_view(),
        name='user_list'
    ),

    path(
        "users/<int:pk>/",
        UserDetailView.as_view(),
        name="user_detail"
    ),

    path(
        'profile/',
        ProfileView.as_view(),
        name='profile'
    ),

    path(
        "admin-only/",
        AdminOnlyView.as_view(),
        name="admin-only"
    ),

    path(
        'change-password/',
        ChangePasswordView.as_view(),
        name='change_password'
    ),

]