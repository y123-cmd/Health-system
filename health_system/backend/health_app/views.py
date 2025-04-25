from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import HealthProgram, Client, Enrollment
from .serializers import (
    HealthProgramSerializer, 
    ClientSerializer, 
    ClientDetailSerializer,
    EnrollmentSerializer
)

class HealthProgramViewSet(viewsets.ModelViewSet):
    queryset = HealthProgram.objects.all()
    serializer_class = HealthProgramSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['first_name', 'last_name', 'email', 'contact_number']
    filterset_fields = ['gender']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ClientDetailSerializer
        return ClientSerializer
    
    @action(detail=True, methods=['post'])
    def enroll(self, request, pk=None):
        client = self.get_object()
        program_id = request.data.get('program_id')
        enrollment_date = request.data.get('enrollment_date')
        notes = request.data.get('notes', '')
        
        try:
            program = HealthProgram.objects.get(id=program_id)
        except HealthProgram.DoesNotExist:
            return Response(
                {'error': 'Program not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if enrollment already exists
        if Enrollment.objects.filter(client=client, program=program).exists():
            return Response(
                {'error': 'Client is already enrolled in this program'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create enrollment
        enrollment_data = {
            'client': client,
            'program': program,
            'notes': notes
        }
        
        if enrollment_date:
            enrollment_data['enrollment_date'] = enrollment_date
        
        enrollment = Enrollment.objects.create(**enrollment_data)
        
        return Response(
            EnrollmentSerializer(enrollment).data, 
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['get'])
    def enrollments(self, request, pk=None):
        client = self.get_object()
        enrollments = Enrollment.objects.filter(client=client)
        serializer = EnrollmentSerializer(enrollments, many=True)
        return Response(serializer.data)

class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['client', 'program', 'status']
