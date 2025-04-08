package com.inappupdates

import android.app.Activity
import android.content.Intent
import com.facebook.react.bridge.*
import com.google.android.play.core.appupdate.AppUpdateManager
import com.google.android.play.core.appupdate.AppUpdateManagerFactory
import com.google.android.play.core.appupdate.AppUpdateInfo
import com.google.android.play.core.install.model.AppUpdateType
import com.google.android.play.core.install.model.UpdateAvailability
import com.google.android.play.core.install.model.InstallStatus

class InAppUpdatesModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), ActivityEventListener {

    private val appUpdateManager: AppUpdateManager = AppUpdateManagerFactory.create(reactContext)
    private val REQUEST_CODE_UPDATE = 1234
    private var updatePromise: Promise? = null

    init {
        reactContext.addActivityEventListener(this)
    }

    override fun getName(): String {
        return "InAppUpdates"
    }

    @ReactMethod
    fun checkForUpdate(updateType: String, promise: Promise) {
        val activity = currentActivity ?: return promise.reject("NO_ACTIVITY", "No current activity")

        appUpdateManager.appUpdateInfo.addOnSuccessListener { appUpdateInfo ->
            if (appUpdateInfo.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE) {
                when (updateType.uppercase()) {
                    "FLEXIBLE" -> startFlexibleUpdate(appUpdateInfo, activity, promise)
                    "IMMEDIATE" -> startImmediateUpdate(appUpdateInfo, activity, promise)
                    else -> promise.reject("INVALID_TYPE", "Update type must be 'FLEXIBLE' or 'IMMEDIATE'")
                }
            } else {
                promise.resolve("No update available")
            }
        }.addOnFailureListener { e ->
            promise.reject("UPDATE_CHECK_FAILED", e.localizedMessage, e)
        }
    }

    private fun startFlexibleUpdate(appUpdateInfo: AppUpdateInfo, activity: Activity, promise: Promise) {
        if (appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.FLEXIBLE)) {
            appUpdateManager.startUpdateFlowForResult(
                appUpdateInfo,
                AppUpdateType.FLEXIBLE,
                activity,
                REQUEST_CODE_UPDATE
            )

            appUpdateManager.registerListener { state ->
                if (state.installStatus() == InstallStatus.DOWNLOADED) {
                    appUpdateManager.completeUpdate()
                }
            }

            promise.resolve("Flexible update started")
        } else {
            promise.reject("NOT_ALLOWED", "Flexible update type not allowed")
        }
    }

    private fun startImmediateUpdate(appUpdateInfo: AppUpdateInfo, activity: Activity, promise: Promise) {
        if (appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE)) {
            updatePromise = promise

            appUpdateManager.startUpdateFlowForResult(
                appUpdateInfo,
                AppUpdateType.IMMEDIATE,
                activity,
                REQUEST_CODE_UPDATE
            )
        } else {
            promise.reject("NOT_ALLOWED", "Immediate update type not allowed")
        }
    }

    override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode == REQUEST_CODE_UPDATE) {
            updatePromise?.let {
                if (resultCode == Activity.RESULT_OK) {
                    it.resolve("Update flow finished")
                } else {
                    it.reject("UPDATE_CANCELLED", "User cancelled the update")
                }
                updatePromise = null
            }
        }
    }
}
