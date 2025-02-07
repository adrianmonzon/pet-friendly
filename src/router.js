import { createRouter, createWebHistory } from "vue-router";
import UserProfile from "@/views/UserProfile.vue";
import EventsCalendar from "@/views/EventsCalendar.vue";
import TheHome from "@/views/TheHome.vue";
import RestaurantDetails from "@/views/RestaurantDetails.vue";
import RestaurantsList from "@/views/RestaurantsList.vue";
import BeachesList from "@/views/BeachesList.vue";
import ShopsList from "@/views/ShopsList.vue";
import VetsClinicsList from "@/views/VetsClinicsList.vue";
import HotelsList from "@/views/HotelsList.vue";


const routes = [
  { path: "/", name: "Home", component: TheHome },
  { path: "/perfil", name: "UserProfile", component: UserProfile },
  { path: "/eventos", name: "EventsCalendar", component: EventsCalendar },
  {
    path: "/restaurantes",
    name: "RestaurantsList",
    component: RestaurantsList,
  },
  {
    path: "/hoteles",
    name: "HotelsList",
    component: HotelsList,
  },
  {
    path: "/playas",
    name: "BeachesList",
    component: BeachesList,
  },
  {
    path: "/comercios",
    name: "ShopsList",
    component: ShopsList,
  },
  {
    path: "/clinicas",
    name: "VetsClinicsList",
    component: VetsClinicsList,
  },
  {
    path: "/restaurant/:id",
    name: "RestaurantDetails",
    component: RestaurantDetails,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
