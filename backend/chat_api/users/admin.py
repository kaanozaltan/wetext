from django.contrib import admin
from .models import User, Jwt


class CustomUserAdmin(admin.ModelAdmin):
    list_display = (
        'username', 'email', 'created_at',
        'updated_at', 'is_superuser'
    )


admin.site.register(User, CustomUserAdmin)
admin.site.register(Jwt)
