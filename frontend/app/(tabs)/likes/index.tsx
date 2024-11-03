import React, {useCallback, useState} from "react";
import Box from "@/components/Box";
import Text from "@/components/Text";
import { useLikesStore } from "@/stores/useLikesStore";
import Topbar from "@/components/navigation/Topbar";
import LoadingCard from "@/components/cards/LoadingCard";
import ErrorCard from "@/components/cards/ErrorCard";
import {FlatList, ImageBackground, Modal, Pressable, RefreshControl, ScrollView} from "react-native";
import LikedEventCard from "@/components/cards/LikedEventCard";
import {useTheme} from "@shopify/restyle";
import {useEventsStore} from "@/stores/useEventsStore";
import {MaterialIcons} from "@expo/vector-icons";
import {useFocusEffect} from "expo-router";
import {useConfig} from "@/shared/providers/TelegramConfig";
import {Theme} from "@/shared/providers/Theme";

export default function LikesScreen() {
  const theme = useTheme<Theme>();
  const username = useConfig().initDataUnsafe.user.username;

  const {
    likes,
    isLoading,
    hasError,
    modalVisible,
    selectedEvent,
    fetchLikes,
    setEventSelected,
    setModalVisible
  } = useLikesStore();

  const { saveAction } = useEventsStore();

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLikes(username);
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchLikes(username);
    }, [fetchLikes])
  )

  if (isLoading) {
    return (
      <Box flex={1} backgroundColor="bg_color">
        <Topbar title={"Понравилось"} />
        <LoadingCard />
      </Box>
    );
  }

  if (hasError) {
    return (
      <Box flex={1} backgroundColor="bg_color">
        <Topbar title={"Понравилось"} />
        <ErrorCard />
      </Box>
    );
  }

  if (likes.length === 0) {
    return (
      <Box flex={1} backgroundColor="bg_color">
        <Topbar title={"Понравилось"} />
        <Box flex={1} justifyContent="center" alignItems="center">
          <Text variant="body" color="text_color">
            { "Нет понравившихся мероприятий" }
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box flex={1} backgroundColor="bg_color">
      <Topbar title={"Понравилось"} />
      <Box
        flex={1}
        backgroundColor="bg_color"
        paddingHorizontal="m"
      >
        <FlatList
          data={likes}
          renderItem={({ item, index }) => (
            <LikedEventCard
              name={item.name}
              date={item.date}
              image={item.image}
              onPress={() => {
                setEventSelected(index);
                setModalVisible(true);
              }}
            />
          )}
          keyExtractor={item => item.name}
          style={{
            width: "100%"
          }}
          contentContainerStyle={{
            paddingBottom: theme.spacing.s,
            gap: 12
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.button_color}
            />
          }
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
        />
      </Box>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onDismiss={ () => setEventSelected(undefined) }
        transparent
      >
        <ImageBackground
          source={{ uri: selectedEvent != undefined ? likes[selectedEvent].image : undefined }}
          blurRadius={4}
          style={{
            flex: 1,
            backgroundColor: "gray",
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            overScrollMode="never"
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.6)'
            }}
          >
            <Box
              gap="l"
              padding="m"
              paddingBottom="l"
            >
              <Text
                variant="header"
                style={{
                  color: "white"
                }}
              >
                { selectedEvent != undefined && likes[selectedEvent].name }
              </Text>

              <Text
                variant="body"
                style={{
                  color: "white"
                }}
              >
                { selectedEvent != undefined  && likes[selectedEvent].description }
              </Text>

              <Box
                bottom={0}
                width={"100%"}
                flexDirection={"row"}
                paddingHorizontal={"m"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Pressable
                  onPress={ () => {
                    setModalVisible(false);
                    saveAction("dislike", likes[selectedEvent!].id, username)
                      .then(() => {
                        handleRefresh();
                        setEventSelected(undefined);
                      });
                  }}
                >
                  <Box width={44} height={44} alignItems={"center"} justifyContent={"center"}
                       style={{ borderRadius: 25, backgroundColor: 'rgb(255,0,0)'}}>
                    <MaterialIcons name="thumb-down" size={20} color="white" />
                  </Box>
                </Pressable>

                <Pressable
                  onPress={ () => setModalVisible(false) }
                >
                  <Box width={44} height={44} alignItems={"center"} justifyContent={"center"}
                       backgroundColor={"button_color"}
                       style={{ borderRadius: 25 }}>
                    <MaterialIcons name="close" size={20} color="white" />
                  </Box>
                </Pressable>
              </Box>
            </Box>
          </ScrollView>
        </ImageBackground>
      </Modal>
    </Box>
  );
}
