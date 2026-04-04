import { PrismaClient, AdminRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const menuItems = [
  // ── Soup ──────────────────────────────────────────────────────────
  {
    category: "Soup",
    name: "Veg Soup",
    price: 60,
    imageUrl:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80",
  },
  {
    category: "Soup",
    name: "Chicken Soup",
    price: 90,
    imageUrl:
      "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=400&q=80",
  },
  {
    category: "Soup",
    name: "Mushroom Soup",
    price: 100,
    imageUrl:
      "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400&q=80",
  },
  {
    category: "Soup",
    name: "Veg Thukpa",
    price: 90,
    imageUrl:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80",
  },
  {
    category: "Soup",
    name: "Chicken Thukpa",
    price: 130,
    imageUrl:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80",
  },
  {
    category: "Soup",
    name: "Egg Thukpa",
    price: 120,
    imageUrl:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80",
  },

  // ── Soft Drinks ───────────────────────────────────────────────────
  {
    category: "Soft Drinks",
    name: "Frooti",
    price: 30,
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  },
  {
    category: "Soft Drinks",
    name: "Dew, Coke & Sprite",
    price: 65,
    imageUrl:
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
  },
  {
    category: "Soft Drinks",
    name: "Redbull (Yellow)",
    price: 140,
    imageUrl:
      "https://images.unsplash.com/photo-1613247882491-e0d0a0e9c37c?w=400&q=80",
  },
  {
    category: "Soft Drinks",
    name: "Redbull (Xtreme)",
    price: 220,
    imageUrl:
      "https://images.unsplash.com/photo-1613247882491-e0d0a0e9c37c?w=400&q=80",
  },
  {
    category: "Soft Drinks",
    name: "Masala Coke & Sprite",
    price: 70,
    imageUrl:
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
  },

  // ── Beer Items ────────────────────────────────────────────────────
  {
    category: "Beer",
    name: "Arna Small (Red)",
    price: 190,
    imageUrl:
      "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&q=80",
  },
  {
    category: "Beer",
    name: "Arna Small (Black)",
    price: 210,
    imageUrl:
      "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&q=80",
  },
  {
    category: "Beer",
    name: "Tiger (Big)",
    price: 350,
    imageUrl:
      "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&q=80",
  },
  {
    category: "Beer",
    name: "Tuborg Strong (Big)",
    price: 450,
    imageUrl:
      "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&q=80",
  },
  {
    category: "Beer",
    name: "Budweiser (Big)",
    price: 450,
    imageUrl:
      "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&q=80",
  },

  // ── Egg Items ─────────────────────────────────────────────────────
  {
    category: "Egg Items",
    name: "Boiled Egg (2 pcs)",
    price: 60,
    imageUrl:
      "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&q=80",
  },
  {
    category: "Egg Items",
    name: "Omlet (2 pcs)",
    price: 60,
    imageUrl:
      "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=400&q=80",
  },
  {
    category: "Egg Items",
    name: "Masala Omlet (2 pcs)",
    price: 70,
    imageUrl:
      "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=400&q=80",
  },
  {
    category: "Egg Items",
    name: "Egg Bhujia",
    price: 80,
    imageUrl:
      "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=400&q=80",
  },

  // ── Salad ─────────────────────────────────────────────────────────
  {
    category: "Salad",
    name: "Nepali Salad",
    price: 80,
    imageUrl:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
  },
  {
    category: "Salad",
    name: "Green Salad",
    price: 100,
    imageUrl:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
  },
  {
    category: "Salad",
    name: "Cucumber Salad",
    price: 80,
    imageUrl:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
  },
  {
    category: "Salad",
    name: "Dry Papad",
    price: 15,
    imageUrl:
      "https://images.unsplash.com/photo-1517244683847-7456b63c5969?w=400&q=80",
  },
  {
    category: "Salad",
    name: "Fry Papad",
    price: 20,
    imageUrl:
      "https://images.unsplash.com/photo-1517244683847-7456b63c5969?w=400&q=80",
  },
  {
    category: "Salad",
    name: "Masala Papad",
    price: 50,
    imageUrl:
      "https://images.unsplash.com/photo-1517244683847-7456b63c5969?w=400&q=80",
  },
  {
    category: "Salad",
    name: "Boil Corn",
    price: 120,
    imageUrl:
      "https://images.unsplash.com/photo-1489282831865-da3b9f5f80d6?w=400&q=80",
  },
  {
    category: "Salad",
    name: "Dameko Corn",
    price: 130,
    imageUrl:
      "https://images.unsplash.com/photo-1489282831865-da3b9f5f80d6?w=400&q=80",
  },
  {
    category: "Salad",
    name: "Salad Pepper",
    price: 150,
    imageUrl:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
  },
  {
    category: "Salad",
    name: "Popcorn",
    price: 220,
    imageUrl:
      "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400&q=80",
  },

  // ── Sadeko ────────────────────────────────────────────────────────
  {
    category: "Sadeko",
    name: "Peanut Masala",
    price: 100,
    imageUrl:
      "https://images.unsplash.com/photo-1574184864703-3487b13f0edd?w=400&q=80",
  },
  {
    category: "Sadeko",
    name: "Sadeko Bhatta",
    price: 60,
    imageUrl:
      "https://images.unsplash.com/photo-1574184864703-3487b13f0edd?w=400&q=80",
  },
  {
    category: "Sadeko",
    name: "Chauchau Sadeko",
    price: 60,
    imageUrl:
      "https://images.unsplash.com/photo-1574184864703-3487b13f0edd?w=400&q=80",
  },
  {
    category: "Sadeko",
    name: "Kaju Fry",
    price: 250,
    imageUrl:
      "https://images.unsplash.com/photo-1574184864703-3487b13f0edd?w=400&q=80",
  },
  {
    category: "Sadeko",
    name: "Mix Sadeko",
    price: 120,
    imageUrl:
      "https://images.unsplash.com/photo-1574184864703-3487b13f0edd?w=400&q=80",
  },
  {
    category: "Sadeko",
    name: "Sweet Corn Sadeko",
    price: 150,
    imageUrl:
      "https://images.unsplash.com/photo-1574184864703-3487b13f0edd?w=400&q=80",
  },

  // ── Chicken Momo ──────────────────────────────────────────────────
  {
    category: "Chicken Momo",
    name: "Chicken Momo Steam",
    price: 130,
    imageUrl:
      "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400&q=80",
  },
  {
    category: "Chicken Momo",
    name: "Chicken Momo Fry",
    price: 150,
    imageUrl:
      "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400&q=80",
  },
  {
    category: "Chicken Momo",
    name: "Chicken Momo Jhol",
    price: 150,
    imageUrl:
      "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400&q=80",
  },
  {
    category: "Chicken Momo",
    name: "Chicken Momo Chilly",
    price: 170,
    imageUrl:
      "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400&q=80",
  },
  {
    category: "Chicken Momo",
    name: "Chicken Momo Kothey",
    price: 180,
    imageUrl:
      "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400&q=80",
  },

  // ── Burgers ───────────────────────────────────────────────────────
  {
    category: "Burgers",
    name: "Veg Burger",
    price: 100,
    imageUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
  },
  {
    category: "Burgers",
    name: "Chicken Burger",
    price: 140,
    imageUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
  },
  {
    category: "Burgers",
    name: "Egg Burger",
    price: 120,
    imageUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
  },

  // ── Chicken Items ─────────────────────────────────────────────────
  {
    category: "Chicken",
    name: "Roast Khaja Set (Full)",
    price: 270,
    imageUrl:
      "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&q=80",
  },
  {
    category: "Chicken",
    name: "Roast Khaja Set (Half)",
    price: 150,
    imageUrl:
      "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&q=80",
  },
  {
    category: "Chicken",
    name: "Bhutuwa Khaja Set (Full)",
    price: 270,
    imageUrl:
      "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&q=80",
  },
  {
    category: "Chicken",
    name: "Bhutuwa Khaja Set (Half)",
    price: 150,
    imageUrl:
      "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&q=80",
  },
  {
    category: "Chicken",
    name: "Roast Only (Full)",
    price: 220,
    imageUrl:
      "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&q=80",
  },
  {
    category: "Chicken",
    name: "Roast Only (Half)",
    price: 120,
    imageUrl:
      "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&q=80",
  },
  {
    category: "Chicken",
    name: "Lollipop (Full)",
    price: 270,
    imageUrl:
      "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&q=80",
  },
  {
    category: "Chicken",
    name: "Lollipop (Half)",
    price: 150,
    imageUrl:
      "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&q=80",
  },
  {
    category: "Chicken",
    name: "Lollipop Chilly (Full)",
    price: 350,
    imageUrl:
      "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&q=80",
  },
  {
    category: "Chicken",
    name: "Lollipop Chilly (Half)",
    price: 180,
    imageUrl:
      "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&q=80",
  },
  {
    category: "Chicken",
    name: "Chicken Chilly",
    price: 260,
    imageUrl:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80",
  },
  {
    category: "Chicken",
    name: "Chicken Sadeko",
    price: 250,
    imageUrl:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80",
  },
  {
    category: "Chicken",
    name: "Chicken Sukuti",
    price: 280,
    imageUrl:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80",
  },
  {
    category: "Chicken",
    name: "Chicken Hariyali",
    price: 300,
    imageUrl:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80",
  },
  {
    category: "Chicken",
    name: "Chicken Pakauda",
    price: 250,
    imageUrl:
      "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&q=80",
  },
  {
    category: "Chicken",
    name: "Chicken Xhoiila",
    price: 280,
    imageUrl:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80",
  },
  {
    category: "Chicken",
    name: "Chicken Manchurian",
    price: 250,
    imageUrl:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80",
  },
  {
    category: "Chicken",
    name: "Boiled Chicken",
    price: 200,
    imageUrl:
      "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&q=80",
  },
  {
    category: "Chicken",
    name: "Chicken Gravy",
    price: 250,
    imageUrl:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80",
  },
  {
    category: "Chicken",
    name: "Chicken 65",
    price: 270,
    imageUrl:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80",
  },

  // ── Tea & Coffee ──────────────────────────────────────────────────
  {
    category: "Tea & Coffee",
    name: "Black Tea",
    price: 20,
    imageUrl:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80",
  },
  {
    category: "Tea & Coffee",
    name: "Milk Tea",
    price: 25,
    imageUrl:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80",
  },
  {
    category: "Tea & Coffee",
    name: "Lemon Tea",
    price: 25,
    imageUrl:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80",
  },
  {
    category: "Tea & Coffee",
    name: "Haveli Masala Tea",
    price: 30,
    imageUrl:
      "https://images.unsplash.com/photo-1566454825481-9c31f5f84286?w=400&q=80",
  },
  {
    category: "Tea & Coffee",
    name: "Milk Coffee",
    price: 60,
    imageUrl:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80",
  },
  {
    category: "Tea & Coffee",
    name: "Black Coffee",
    price: 40,
    imageUrl:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80",
  },
  {
    category: "Tea & Coffee",
    name: "Hot Lemon",
    price: 30,
    imageUrl:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80",
  },
  {
    category: "Tea & Coffee",
    name: "Hot Lemon with Honey",
    price: 80,
    imageUrl:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80",
  },

  // ── Breakfast ─────────────────────────────────────────────────────
  {
    category: "Breakfast",
    name: "Bread Omelet",
    price: 50,
    imageUrl:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80",
  },
  {
    category: "Breakfast",
    name: "Bread Jam",
    price: 50,
    imageUrl:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80",
  },
  {
    category: "Breakfast",
    name: "Butter Toast",
    price: 40,
    imageUrl:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80",
  },
  {
    category: "Breakfast",
    name: "Veg Sandwich",
    price: 60,
    imageUrl:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80",
  },
  {
    category: "Breakfast",
    name: "Chicken Sandwich",
    price: 80,
    imageUrl:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80",
  },
  {
    category: "Breakfast",
    name: "Powa Special",
    price: 100,
    imageUrl:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80",
  },

  // ── Veg Momos ─────────────────────────────────────────────────────
  {
    category: "Veg Momo",
    name: "Veg Momo Steam",
    price: 100,
    imageUrl:
      "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400&q=80",
  },
  {
    category: "Veg Momo",
    name: "Veg Momo Fry",
    price: 120,
    imageUrl:
      "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400&q=80",
  },
  {
    category: "Veg Momo",
    name: "Veg Momo Jhol",
    price: 120,
    imageUrl:
      "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400&q=80",
  },
  {
    category: "Veg Momo",
    name: "Veg Momo Chilly",
    price: 150,
    imageUrl:
      "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400&q=80",
  },
  {
    category: "Veg Momo",
    name: "Veg Momo Kothey",
    price: 150,
    imageUrl:
      "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400&q=80",
  },

  // ── Veg Items ─────────────────────────────────────────────────────
  {
    category: "Veg Items",
    name: "Paneer Chilly",
    price: 300,
    imageUrl:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80",
  },
  {
    category: "Veg Items",
    name: "Paneer Pakoda",
    price: 280,
    imageUrl:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80",
  },
  {
    category: "Veg Items",
    name: "Chilly Potato",
    price: 150,
    imageUrl:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80",
  },
  {
    category: "Veg Items",
    name: "Mushroom Tuppa",
    price: 200,
    imageUrl:
      "https://images.unsplash.com/photo-1560717845-968823efbee1?w=400&q=80",
  },
  {
    category: "Veg Items",
    name: "Mushroom Pakoda",
    price: 250,
    imageUrl:
      "https://images.unsplash.com/photo-1560717845-968823efbee1?w=400&q=80",
  },
  {
    category: "Veg Items",
    name: "French Fry",
    price: 100,
    imageUrl:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80",
  },
  {
    category: "Veg Items",
    name: "Veg Manchurian",
    price: 150,
    imageUrl:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80",
  },
  {
    category: "Veg Items",
    name: "Honey Chilly Cauliflower",
    price: 150,
    imageUrl:
      "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=400&q=80",
  },
  {
    category: "Veg Items",
    name: "Mixed Pakoda",
    price: 90,
    imageUrl:
      "https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&q=80",
  },
  {
    category: "Veg Items",
    name: "Onion Pakoda",
    price: 80,
    imageUrl:
      "https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&q=80",
  },

  // ── Sausage ───────────────────────────────────────────────────────
  {
    category: "Sausage",
    name: "Boil Sausage (6 pcs)",
    price: 260,
    imageUrl:
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80",
  },
  {
    category: "Sausage",
    name: "Fry Sausage (6 pcs)",
    price: 280,
    imageUrl:
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80",
  },
  {
    category: "Sausage",
    name: "Chilly Sausage (6 pcs)",
    price: 300,
    imageUrl:
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80",
  },

  // ── Chaumin ───────────────────────────────────────────────────────
  {
    category: "Chaumin",
    name: "Veg Chaumin",
    price: 100,
    imageUrl:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80",
  },
  {
    category: "Chaumin",
    name: "Paneer Chaumin",
    price: 180,
    imageUrl:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80",
  },
  {
    category: "Chaumin",
    name: "Chicken Chaumin",
    price: 180,
    imageUrl:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80",
  },
  {
    category: "Chaumin",
    name: "Egg Chaumin",
    price: 150,
    imageUrl:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80",
  },
  {
    category: "Chaumin",
    name: "Bhutan Chaumin",
    price: 180,
    imageUrl:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80",
  },
  {
    category: "Chaumin",
    name: "Chicken Tuppa",
    price: 130,
    imageUrl:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80",
  },
  {
    category: "Chaumin",
    name: "Egg Tuppa",
    price: 120,
    imageUrl:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80",
  },
  {
    category: "Chaumin",
    name: "Mixed Tuppa",
    price: 100,
    imageUrl:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80",
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing menu items
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.admin.deleteMany();

  // Seed menu items
  for (const item of menuItems) {
    await prisma.menuItem.create({ data: item });
  }
  console.log(`✅ Created ${menuItems.length} menu items`);

  // Create default super admin
  const hashedPassword = await bcrypt.hash("Admin@1234", 12);
  await prisma.admin.create({
    data: {
      name: "Super Admin",
      email: "admin@haveli.com",
      password: hashedPassword,
      role: AdminRole.SUPER_ADMIN,
    },
  });
  console.log("✅ Created default admin: admin@haveli.com / Admin@1234");

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
