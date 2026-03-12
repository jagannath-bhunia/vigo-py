from django import forms
from users.models import User

# class UserForm(forms.ModelForm):
#     class Meta:
#         model = User
#         fields = ['email', 'password' ]
#         widgets = {
#             'email': forms.EmailInput(attrs={'class':'form-control'}),
#             'password': forms.PasswordInput(attrs={'class':'form-control'}),
            
#         }

class UserForm(forms.Form):
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'placeholder': 'Email',
            'id': 'email',
            'autocomplete': 'on'
        })
    )

    password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Password',
            'id': 'password',
            'autocomplete': 'on'
        })
    )