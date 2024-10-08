from django.db import models


class GenericModel(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class User(GenericModel):
    username = models.CharField(max_length=250)


class Tags(GenericModel):
    name = models.CharField(max_length=250, db_index=True)
    description = models.TextField()
    # todo: нужно сохранять картинку к тегу

    def __str__(self):
        return f"{self.name}"


class Content(GenericModel):
    name = models.CharField(max_length=250)
    description = models.TextField()
    tags = models.ManyToManyField(Tags, related_name='contents')
    image = models.ImageField(upload_to="images", max_length=300)
    contact = models.CharField(max_length=250)
    date = models.DateTimeField(null=True, blank=True)

    def get_tags(self):
        return "\n".join([t.name for t in self.tags.all()])


class Like(GenericModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.ForeignKey(Content, on_delete=models.CASCADE)
    value = models.BooleanField()

    class Meta:
        unique_together = (
            "user",
            "content",
            "value",
        )

    def __str__(self):
        return f"{self.user.username} - {self.content.name} - {self.value}"
