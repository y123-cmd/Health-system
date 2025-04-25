from rest_framework import serializers
from .models import HealthProgram, Client, Enrollment

class HealthProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthProgram
        fields = '__all__'

class EnrollmentSerializer(serializers.ModelSerializer):
    program_name = serializers.ReadOnlyField(source='program.name')
    
    class Meta:
        model = Enrollment
        fields = ['id', 'program', 'program_name', 'enrollment_date', 'status', 'notes']

class ClientSerializer(serializers.ModelSerializer):
    age = serializers.ReadOnlyField()
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = Client
        fields = '__all__'

class ClientDetailSerializer(serializers.ModelSerializer):
    enrollments = serializers.SerializerMethodField()
    age = serializers.ReadOnlyField()
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = Client
        fields = '__all__'
    
    def get_enrollments(self, obj):
        enrollments = Enrollment.objects.filter(client=obj)
        return EnrollmentSerializer(enrollments, many=True).data