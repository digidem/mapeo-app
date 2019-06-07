// @flow
import React from "react";
import { Text, Image, View, ScrollView, StyleSheet, Share } from "react-native";
import ShareMedia from "react-native-share";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import api from "../../api";
import FormattedCoords from "../../sharedComponents/FormattedCoords";
import ThumbnailScrollView from "../../sharedComponents/ThumbnailScrollView";
import { DetailsIcon, CategoryIcon } from "../../sharedComponents/icons";
import { formatDate, formatCoords } from "../../lib/utils";
import { filterPhotosFromAttachments } from "../../context/DraftObservationContext";
import { RED, WHITE } from "../../lib/styles";
import { TouchableOpacity } from "../../sharedComponents/Touchables";
import type { PresetWithFields } from "../../context/PresetsContext";
import type { Observation } from "../../context/ObservationsContext";

// const InsetMapView = ({ style }) => <View style={[style, styles.insetMap]} />;

type ButtonProps = {
  onPress: () => any,
  color: string,
  iconName: "delete-forever" | "share",
  title: string
};

const Button = ({ onPress, color, iconName, title }: ButtonProps) => (
  <TouchableOpacity onPress={onPress}>
    <View style={[styles.button, { backgroundColor: color }]}>
      <MaterialIcons
        size={30}
        name={iconName}
        color={WHITE}
        style={styles.buttonIcon}
      />
      <Text style={styles.buttonText}>{title}</Text>
    </View>
  </TouchableOpacity>
);

const FieldView = ({ label, answer }) => (
  <View style={{ marginLeft: 15 }}>
    <Text style={styles.fieldTitle}>{label}</Text>
    <Text
      style={[
        styles.fieldAnswer,
        { color: answer === undefined ? "gray" : "black" }
      ]}
    >
      {answer || "Sin respuesta"}
    </Text>
  </View>
);

type ODVProps = {|
  observation: Observation,
  preset?: PresetWithFields,
  onPressPhoto: (photoIndex: number) => any,
  onPressDelete: () => any
|};

class ObservationView extends React.Component<ODVProps> {
  handleShare = () => {
    const { observation, preset } = this.props;
    const { value } = observation;
    const msg = formatShareMessage({ observation, preset });

    if (value.attachments && value.attachments.length) {
      const urls = value.attachments.map(a =>
        api.getMediaFileUri(a.id, "preview")
      );
      const options = {
        urls: urls,
        message: msg,
        subject: "Alerta de Mapeo"
      };
      ShareMedia.open(options);
    } else Share.share({ message: msg });
  };

  render() {
    const { observation, preset, onPressPhoto, onPressDelete } = this.props;
    const { lat, lon, attachments } = observation.value;
    // Currently only show photo attachments
    const photos = filterPhotosFromAttachments(attachments);
    return (
      <ScrollView style={styles.container}>
        <>
          <Image
            source={require("../../images/category-pin.png")}
            style={styles.categoryPin}
          />
          <View style={styles.categoryIconContainer}>
            <CategoryIcon iconId={(preset || {}).icon} />
          </View>
          {lat != null && lon != null && (
            <View style={{ flexDirection: "row", alignSelf: "center" }}>
              <FormattedCoords
                lon={lon}
                lat={lat}
                style={styles.positionText}
              />
            </View>
          )}
          <Text style={styles.time}>{formatDate(observation.created_at)}</Text>
          <View style={styles.section}>
            <Text style={styles.textNotes}>{observation.value.tags.notes}</Text>
          </View>
          {/* Not including this until we have a map here
        lat != null && lon != null && (
          <View style={styles.section}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 15
              }}
            >
              <LocationIcon size={20} />
              <FormattedCoords lon={lon} lat={lat} style={styles.sectionText} />
            </View>
            <InsetMapView style={{ height: 240 }} />
          </View>
        ) */}
          {!!photos.length && (
            <ThumbnailScrollView photos={photos} onPressPhoto={onPressPhoto} />
          )}
          {preset && preset.fields && preset.fields.length > 0 && (
            <View style={styles.section}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: 15
                }}
              >
                <DetailsIcon size={20} />
                <Text style={styles.sectionText}>Detalles</Text>
              </View>
              <>
                {preset.fields.map(({ label, key }) => (
                  <FieldView
                    key={key}
                    label={label || key}
                    answer={observation.value.tags[key]}
                  />
                ))}
              </>
            </View>
          )}
          <View style={styles.buttonContainer}>
            <Button
              iconName="share"
              title="Compartir"
              color="#3366FF"
              onPress={this.handleShare}
            />
            <Button
              iconName="delete-forever"
              title="Borrar"
              color={RED}
              onPress={onPressDelete}
            />
          </View>
        </>
      </ScrollView>
    );
  }
}

export default ObservationView;

function formatShareMessage({
  observation,
  preset
}: {
  observation: Observation,
  preset?: PresetWithFields
}) {
  const { value } = observation;
  let msg = "";
  if (preset && preset.name) msg += "— *" + preset.name + "* —\n";
  msg += formatDate(observation.created_at) + "\n";
  if (value.lat != null && value.lon != null)
    msg += formatCoords({ lon: value.lon, lat: value.lat }) + "\n";
  if (value.tags.notes) msg += "\n" + value.tags.notes + "\n";
  const completedFields =
    preset &&
    preset.fields &&
    preset.fields.filter(f => typeof value.tags[f.key] !== "undefined");
  if (completedFields && completedFields.length) {
    msg +=
      "\n" +
      completedFields
        .map(f => "_" + f.label + ":_\n" + value.tags[f.key])
        .join("\n") +
      "\n";
  }
  msg += "\n— _Enviado desde MAPEO_ —";
  return msg;
}

const styles = StyleSheet.create({
  categoryIconContainer: {
    alignSelf: "center",
    position: "absolute",
    top: 25
  },
  categoryPin: {
    alignSelf: "center",
    width: 80,
    height: 85,
    marginTop: 5
  },
  container: {
    backgroundColor: "white",
    flex: 1,
    flexDirection: "column"
  },
  positionText: {
    fontSize: 12,
    color: "black",
    fontWeight: "700"
  },
  section: {
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
    flex: 1
  },
  sectionText: {
    color: "black",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 15,
    marginLeft: 10,
    marginTop: 15
  },
  textNotes: {
    color: "black",
    fontSize: 18,
    fontWeight: "700",
    margin: 20,
    textAlign: "center"
  },
  time: {
    color: "grey",
    fontSize: 12,
    fontWeight: "300",
    textAlign: "center"
  },
  fieldAnswer: {
    color: "black",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 7,
    marginBottom: 15
  },
  fieldTitle: {
    color: "black",
    fontSize: 14,
    fontWeight: "700"
  },
  button: {
    borderRadius: 30,
    height: 50,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    marginVertical: 10
  },
  buttonIcon: {
    flex: 0,
    paddingRight: 10
  },
  buttonText: {
    flex: 1,
    color: WHITE,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginRight: 40
  },
  buttonContainer: {
    paddingVertical: 10,
    flex: 1,
    flexDirection: "column"
  }
});
