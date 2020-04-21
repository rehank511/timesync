from django.urls import path, re_path, include
from . import views
from rest_framework import routers
from knox import views as knox_views

router = routers.DefaultRouter()
# router.register('users', views.UserView)
router.register('calendars', views.CalendarView)
router.register('events', views.EventView)
router.register('friendships', views.FriendshipView)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/auth', include('knox.urls')),
    path('api/auth/register', views.RegisterView.as_view()),
    path('api/auth/login', views.LoginView.as_view()),
    path('api/auth/user', views.UserView.as_view()),
    path('api/auth/logout', knox_views.LogoutView.as_view(), name='knox_logout'),
    re_path(r'^(?:.*)/?$', views.index)
]
