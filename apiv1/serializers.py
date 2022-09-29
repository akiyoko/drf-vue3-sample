from rest_framework import serializers

from shop.models import Book


class BookSerializer(serializers.ModelSerializer):

    class Meta:
        model = Book
        fields = ['id', 'title', 'price']
        extra_kwargs = {
            'title': {
                'error_messages': {
                    'blank': 'タイトルは空にできません。',
                }
            },
            'price': {
                'error_messages': {
                    'invalid': '価格には有効な整数を入力してください。',
                }
            },
        }
