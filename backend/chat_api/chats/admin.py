from django.contrib import admin

from .models import Message


class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'receiver', 'created_at',)


admin.site.register(Message, MessageAdmin)


