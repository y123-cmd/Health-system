from django.contrib import admin
from .models import HealthProgram, Client, Enrollment

@admin.register(HealthProgram)
class HealthProgramAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name', 'description')

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'date_of_birth', 'gender', 'contact_number')
    list_filter = ('gender',)
    search_fields = ('first_name', 'last_name', 'contact_number', 'email')

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('client', 'program', 'enrollment_date', 'status')
    list_filter = ('status', 'program')
    search_fields = ('client__first_name', 'client__last_name', 'program__name')
