const adminRoutes = {
  path: "/admin",
  component: () => import("../layouts/AdminLayout.vue"),
  meta: { requiresAuth: true, role: "admin" },
  children: [
    {
      path: "residents",
      name: "AdminResidents",
      component: () => import("../views/admin/resident/ResidentDataView.vue"),
    },
    {
      path: "residents/create",
      name: "AdminResidentsCreate",
      component: () => import("../views/admin/resident/ResidentFormView.vue"),
    },
    {
      path: "residents/edit/:id",
      name: "AdminResidentsEdit",
      component: () => import("../views/admin/resident/ResidentFormView.vue"),
    },
    {
      path: "committee",
      name: "AdminCommittee",
      component: () => import("../views/admin/committee/CommitteeDataView.vue"),
    },
    {
      path: "committee/create",
      name: "AdminCommitteeCreate",
      component: () => import("../views/admin/committee/CommitteeFormView.vue"),
    },
    {
      path: "committee/edit/:id",
      name: "AdminCommitteeEdit",
      component: () => import("../views/admin/committee/CommitteeFormView.vue"),
    },
    {
      path: "committee/:id",
      name: "AdminCommitteeDetail",
      component: () =>
        import("../views/admin/committee/CommitteeDetailView.vue"),
    },
    {
      path: "speakers",
      name: "AdminSpeakers",
      component: () => import("../views/admin/speaker/SpeakersDataView.vue"),
    },
    {
      path: "speakers/create",
      name: "AdminSpeakersCreate",
      component: () => import("../views/admin/speaker/SpeakersFormView.vue"),
    },
    {
      path: "speakers/edit/:id",
      name: "AdminSpeakersEdit",
      component: () => import("../views/admin/speaker/SpeakersFormView.vue"),
    },
    {
      path: "speakers/:id",
      name: "AdminSpeakerDetail",
      component: () => import("../views/admin/speaker/SpeakersDetailView.vue"),
    },
    {
      path: "events",
      name: "AdminEvents",
      component: () => import("../views/admin/event/EventsDataView.vue"),
    },
    {
      path: "events/create",
      name: "AdminEventsCreate",
      component: () => import("../views/admin/event/EventFormView.vue"),
    },
    {
      path: "events/edit/:id",
      name: "AdminEventsEdit",
      component: () => import("../views/admin/event/EventFormView.vue"),
    },
    {
      path: "events/:id",
      name: "AdminEventDetail",
      component: () => import("../views/admin/event/EventDetailView.vue"),
    },
    {
      path: "help",
      name: "AdminHelp",
      component: () => import("../views/admin/help/HelpView.vue"),
    },
  ],
};

export default adminRoutes;
