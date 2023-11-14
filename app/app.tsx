/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react-native/no-color-literals */
import { StatusBar } from "expo-status-bar"
import { Button, StyleSheet, Text, View } from "react-native"
import TrackPlayer, { useActiveTrack, useIsPlaying } from "@5stones/react-native-track-player"
import { PlaybackService, QueueInitialTracksService, SetupService } from "./player"
import { useEffect, useState } from "react"

TrackPlayer.registerPlaybackService(() => PlaybackService)

export default function App() {
  const track = useActiveTrack()
  const isPlayerReady = useSetupPlayer()
  const { playing, bufferingDuringPlay } = useIsPlaying()

  console.log("isPlayerReady", isPlayerReady)
  console.log("track", track)

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Button onPress={playing ? TrackPlayer.pause : TrackPlayer.play} title="Play" />
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
  },
})

function useSetupPlayer() {
  const [playerReady, setPlayerReady] = useState(false)

  useEffect(() => {
    let unmounted = false
    ;(async () => {
      await SetupService()
      if (unmounted) return
      setPlayerReady(true)
      const queue = await TrackPlayer.getQueue()
      if (unmounted) return
      if (queue.length <= 0) {
        await QueueInitialTracksService()
      }
    })()
    return () => {
      unmounted = true
    }
  }, [])
  return playerReady
}
