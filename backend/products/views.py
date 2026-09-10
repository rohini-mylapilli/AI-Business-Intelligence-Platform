from rest_framework import generics
from .models import Product
from .serializers import ProductSerializer
from .permissions import IsAdminOrManager, IsAdmin, IsAnyRole

class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdminOrManager()]
        return [IsAnyRole()]

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH']:
            return[IsAdminOrManager()]
        if self.request.method == 'DELETE':
            return [IsAdmin()]
        return [IsAnyRole()]