from django.contrib import admin
from .models import Content, Tags, Like, User


@admin.register(Content)
class ContentAdmin(admin.ModelAdmin):
    list_display = ('name', 'image', 'contact', 'get_tags')


@admin.register(Tags)
class TagsAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    pass


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', )
