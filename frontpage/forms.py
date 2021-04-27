from django import forms
from frontpage.models import SessionMap

class ContactForm(forms.Form):
    name = forms.CharField(label='name', max_length=100)
    subject = forms.CharField(label='subject', max_length=200)
    sender = forms.EmailField()
    message = forms.CharField(widget=forms.Textarea)


class FilterForm(forms.ModelForm):
    class Meta:
        model = SessionMap
        fields = ['genre1','genre2']