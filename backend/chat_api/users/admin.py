from django.contrib import admin
from .models import User


class CustomUserAdmin(admin.ModelAdmin):
    list_display = (
        'username', 'first_name', 'last_name', 'created_at',
        'updated_at', 'is_superuser', 'is_active',
    )


admin.site.register(User, CustomUserAdmin)
