import 'package:flutter/material.dart';
import 'package:yayscribbl/Screens/create_room_screen.dart';
import 'package:yayscribbl/Screens/home_screen.dart';
import 'package:yayscribbl/Screens/join_room_screen.dart';
import 'package:yayscribbl/Screens/paint_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: 'Flutter Demo',
        theme: ThemeData(
          // primaryColor: const Color.fromARGB(255, 84, 9, 163),
          primarySwatch: Colors.deepOrange,
        ),
        home: const MyHomePage(),
        routes: {
          '/create_room_screen': (ctx) => CreateRoomScreen(),
          '/join_room_screen': (ctx) => JoinRoomScreen(),
          '/paint_screen': (context) => PaintScreen(),
        });
  }
}
