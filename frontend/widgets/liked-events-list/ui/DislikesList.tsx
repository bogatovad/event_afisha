import React, {useEffect} from "react";
import {Box, ErrorCard, LoadingCard, Text} from "@/shared/ui";
import {FlatList, ImageBackground, Modal, Pressable, ScrollView} from "react-native";
import {useTheme} from "@shopify/restyle";
import {Hyperlink} from "react-native-hyperlink";
import {useCalendarStore} from "@/features/dates";
import {useReactionsStore} from "@/features/likes-dislikes";
import {LikedEventCard} from "@/entities/event";
import {Theme} from "@/shared/providers/Theme";
import {useConfig} from "@/shared/providers/TelegramConfig";
import {getPeriodBorders} from "@/shared/scripts/date";
import {WEB_APP_URL} from "@env";
import Icon from "@/shared/ui/Icons/Icon";
import {useEventsSwiperStore} from "@/features/content";

export const DislikesList = React.memo(() => {
  const theme = useTheme<Theme>();
  const username = useConfig().initDataUnsafe.user.username;
  const config = useConfig();

  const [selectedEvent, setEventSelected] = React.useState<number | undefined>(undefined);
  const [modalVisible, setModalVisible] = React.useState(false);

  const {
    dislikes,
    isDislikesLoading, hasDislikesError,
    removeLikedEvent,
    fetchReactions,
    saveAction
  } = useReactionsStore();

  const { selectedDays } = useCalendarStore();
  const { addEvent } = useEventsSwiperStore()

  useEffect(() => {
    if (config.BackButton) {
      if (modalVisible) {
        config.BackButton.show();
        config.BackButton.onClick(() => setModalVisible(false))
      } else {
        config.BackButton.hide();
      }
    }

    return () => { if (config.BackButton) config.BackButton!.hide(); }
  }, [modalVisible]);

  useEffect(() => {
    const borders = getPeriodBorders(Object.keys(selectedDays));
    fetchReactions({
      username: username,
      date_start: borders.date_start, date_end: borders.date_end,
      value: "False"
    });
  }, [selectedDays]);

  if (isDislikesLoading) {
    return (
      <Box flex={1}>
        <FlatList
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          data={ Array(6) }
          renderItem={({ index }) => (
            <LoadingCard key={index} style={{ minHeight: 120, flex: 1, borderRadius: 16 }}/>
          )}
          style={{ width: "100%" }}
          contentContainerStyle={{
            padding: theme.spacing.m,
            gap: 12
          }}
        />
      </Box>
    )
  }

  if (hasDislikesError) {
    return (
      <Box flex={1} backgroundColor="bg_color">
        <ErrorCard />
      </Box>
    );
  }

  if (dislikes.length === 0) {
    return (
      <Box flex={1} backgroundColor="bg_color" justifyContent="center" alignItems="center">
        <Text variant="body" color="text_color">
          { "Нет понравившихся мероприятий" }
        </Text>
      </Box>
    );
  }

  return (
    <Box
      flex={1}
      backgroundColor="bg_color"
    >
      <FlatList
        data={ dislikes }
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
          padding: theme.spacing.m,
          gap: 12
        }}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        onDismiss={ () => setEventSelected(undefined) }
        transparent
      >
        <ImageBackground
          source={{ uri: selectedEvent != undefined ? dislikes[selectedEvent].image : undefined }}
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
              <Box
                flexDirection={"row"}
                alignItems={"center"}
                gap={"s"}
              >
                <Text
                  variant="header"
                  color={"white"}
                  style={{
                    flex: 1
                  }}
                >
                  { selectedEvent != undefined && dislikes[selectedEvent].name }
                </Text>

                {
                  selectedEvent != undefined && (
                    <Pressable
                      onPress={ () => {
                        const link = `${WEB_APP_URL}?startapp=${dislikes[selectedEvent].id}`;
                        const encodedMessage = encodeURIComponent(`Привет! Посмотри это мероприятие`);

                        console.log("Sharing event with link:", link);

                        config.openTelegramLink(`https://t.me/share/url?text=${encodedMessage}&url=${link}`);
                      }}
                    >
                      <Box
                        backgroundColor={"cardBGColor"}
                        height={40}
                        width={40}
                        alignItems={"center"}
                        justifyContent={"center"}
                        borderRadius={"xl"}
                      >
                        <Icon
                          name={"share"}
                          color={theme.colors.white}
                          size={24}
                        />
                      </Box>
                    </Pressable>
                  )
                }
              </Box>

              <Text
                variant="body"
                style={{
                  color: "white"
                }}
              >
                { selectedEvent != undefined  && dislikes[selectedEvent].description }
              </Text>

              {
                selectedEvent != undefined &&
                dislikes[selectedEvent].contact &&
                dislikes[selectedEvent].contact!.length > 0 &&
                (
                  <Box
                    gap={"s"}
                  >
                    <Text
                      variant={"body"}
                      color={"cardSubtextColor"}
                    >
                      { "Ссылки:" }
                    </Text>

                    {dislikes[selectedEvent].contact?.map((con, index) => {
                      return (
                        <Hyperlink
                          key={index}
                          linkDefault={true}
                          linkStyle={{ color: theme.colors.link_color }}
                          onPress={ () => config.openLink(Object.values(con)[0], { try_instant_view: true }) }
                          linkText={(url) => {
                            const contact = dislikes[selectedEvent].contact!.find((c) => Object.values(c)[0] === url);
                            return contact ? Object.keys(contact)[0] : url;
                          }}
                        >
                          <Text
                            variant={"body"}
                          >
                            {Object.values(con)[0]}
                          </Text>
                        </Hyperlink>
                      );
                    })}
                  </Box>
                )
              }
            </Box>

            <Box
              gap={"m"}
              padding={"m"}
            >
              <Pressable
                onPress={ () => {
                  setModalVisible(false);
                  saveAction({
                    action: "delete_mark",
                    contentId: dislikes[selectedEvent!].id,
                    username: username
                  })
                    .then(() => {
                      removeLikedEvent(dislikes[selectedEvent!].id);
                      addEvent(dislikes[selectedEvent!]);
                      setEventSelected(undefined);
                    });
                }}
              >
                <Box
                  width={"100%"} height={44}
                  alignItems={"center"} justifyContent={"center"}
                  backgroundColor={"lime"}
                  borderRadius={"m"}
                >
                  <Text
                    variant={"likedEventButton"}
                    color={"black"}
                    textAlign={"center"}
                  >
                    { "Удалить из избранного" }
                  </Text>
                </Box>
              </Pressable>

              <Pressable
                onPress={ () => {
                  setModalVisible(false);
                  saveAction({
                    action: "dislike",
                    contentId: dislikes[selectedEvent!].id,
                    username: username
                  })
                    .then(() => {
                      removeLikedEvent(dislikes[selectedEvent!].id);
                      setEventSelected(undefined);
                    });
                }}
              >
                <Box
                  width={"100%"} height={44}
                  alignItems={"center"} justifyContent={"center"}
                  backgroundColor={"gray"}
                  borderRadius={"m"}
                >
                  <Text
                    variant={"likedEventButton"}
                    color={"red"}
                    textAlign={"center"}
                  >
                    { "Не нравится" }
                  </Text>
                </Box>
              </Pressable>
            </Box>
          </ScrollView>
        </ImageBackground>
      </Modal>
    </Box>
  )
})
