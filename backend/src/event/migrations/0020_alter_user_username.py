# Generated by Django 4.2 on 2025-03-07 11:08

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("event", "0019_alter_content_options_rename_date_content_date_end_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="username",
            field=models.CharField(max_length=250, unique=True),
        ),
    ]
