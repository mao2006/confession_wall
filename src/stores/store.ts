import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const login_store = defineStore('login', 
  {
    state:()=>({
      login_status:false,
    })
  }
)
