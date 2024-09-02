from django.contrib import admin
from .models import Content, Tags, Like


@admin.register(Content)
class ContentAdmin(admin.ModelAdmin):
    list_display = ('name', 'image', 'contact')


@admin.register(Tags)
class TagsAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    pass
