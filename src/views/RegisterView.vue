<script setup>
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { supabase } from "../lib/supabase";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-vue-next";

const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const handleRegister = async () => {
  if (!name.value || !email.value || !password.value) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "All fields are required.",
    });
    return;
  }
  if (password.value !== confirmPassword.value) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Passwords do not match.",
    });
    return;
  }

  try {
    loading.value = true;
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          name: name.value,
          role: "resident",
        },
      },
    });

    if (error) throw error;

    await Swal.fire({
      icon: "success",
      title: "Registration Successful!",
      text: "Please login to continue.",
    });
    router.push("/login");
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Registration Failed",
      text: error.message,
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-md mx-auto mt-10 p-8 border rounded-lg shadow-lg bg-white">
    <h1 class="text-3xl font-bold text-center text-primary mb-6">
      Create an Account
    </h1>
    <form @submit.prevent="handleRegister">
      <div class="mb-4">
        <label for="name" class="block text-gray-700 mb-2">Full Name</label>
        <input
          v-model="name"
          type="text"
          id="name"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>
      <div class="mb-4">
        <label for="email" class="block text-gray-700 mb-2">Email</label>
        <input
          v-model="email"
          type="email"
          id="email"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>
      <div class="mb-6 relative">
        <label for="password" class="block text-gray-700 mb-2">Password</label>
        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          id="password"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <button
          type="button"
          @click="showPassword = !showPassword"
          class="absolute inset-y-0 right-0 top-7 px-3 flex items-center text-gray-600"
        >
          <Eye v-if="!showPassword" class="h-5 w-5" />
          <EyeOff v-else class="h-5 w-5" />
        </button>
      </div>
      <div class="mb-6 relative">
        <label for="confirm-password" class="block text-gray-700 mb-2"
          >Confirm Password</label
        >
        <input
          v-model="confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          id="confirm-password"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <button
          type="button"
          @click="showConfirmPassword = !showConfirmPassword"
          class="absolute inset-y-0 right-0 top-7 px-3 flex items-center text-gray-600"
        >
          <Eye v-if="!showConfirmPassword" class="h-5 w-5" />
          <EyeOff v-else class="h-5 w-5" />
        </button>
      </div>
      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-primary text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-400"
      >
        {{ loading ? "Registering..." : "Register" }}
      </button>
    </form>
    <p class="text-center mt-4">
      Already have an account?
      <RouterLink to="/login" class="text-primary hover:underline"
        >Login here</RouterLink
      >
    </p>
  </div>
</template>
