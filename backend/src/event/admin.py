from django.contrib import admin
from .models import Content, Tags, Like, User, Feedback


@admin.register(Content)
class ContentAdmin(admin.ModelAdmin):
    list_display = ('name', 'image', 'contact', 'get_tags', 'date')


@admin.register(Tags)
class TagsAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    pass


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'created')


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('user', 'message', 'created')
