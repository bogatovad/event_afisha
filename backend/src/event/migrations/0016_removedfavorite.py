# Generated by Django 4.2 on 2024-12-19 11:41

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('event', '0015_content_cost_content_location_content_time'),
    ]

    operations = [
        migrations.CreateModel(
            name='RemovedFavorite',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('removed_at', models.DateTimeField(auto_now_add=True)),
                ('content', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='event.content')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='event.user')),
            ],
            options={
                'unique_together': {('user', 'content')},
            },
        ),
    ]
