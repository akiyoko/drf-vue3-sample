import uuid

from django.db import models


class Book(models.Model):
    """本モデル"""

    class Meta:
        db_table = 'book'
        verbose_name = verbose_name_plural = '本'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(verbose_name='タイトル', max_length=20,
                             unique=True)
    price = models.IntegerField(verbose_name='価格', null=True, blank=True)
    created_at = models.DateTimeField(verbose_name='登録日時',
                                      auto_now_add=True)

    def __str__(self):
        return self.title
