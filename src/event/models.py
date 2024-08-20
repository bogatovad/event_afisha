from django.db import models


class GenericModel(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class User(GenericModel):
    name = models.CharField(max_length=250)
    age = models.IntegerField()
    gender = models.CharField(max_length=250)
    type = models.CharField(max_length=250)
    city = models.CharField(max_length=250)
    tags = models.ManyToManyField("Tags")


class Tags(GenericModel):
    name = models.CharField(max_length=250)
    description = models.TextField()


class Content(GenericModel):
    name = models.CharField(max_length=250)
    description = models.TextField()
    tags = models.ManyToManyField(Tags)
    image = models.ImageField(upload_to="images", max_length=300)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    contact = models.CharField(max_length=250)


class Like(GenericModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.ForeignKey(Content, on_delete=models.CASCADE)
    value = models.BooleanField()

    class Meta:
        unique_together = (
            "user",
            "content",
        )
